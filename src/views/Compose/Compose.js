import React from "react"
import TopNavbar from "../Shared/TopNavbar"
import { ArrowTopRightOnSquareIcon, CheckIcon, ExclamationTriangleIcon, LockClosedIcon, PencilIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { Link, useNavigate } from "react-router-dom"

import { default as Neon, sc } from "@cityofzion/neon-js";
import * as neons from '../../services/neons'
import * as crypto from '../../services/crypto'
import InboxDialog from '../Components/InboxDialog'
import { useAccountContext } from "../../contexts/AccountContext";
import { Dialog, Transition } from '@headlessui/react'


export default function Compose(props) {

    const accountContext = useAccountContext()
    const navigate = useNavigate();

    const MAX_MESSAGE_CHARACTER = 100

    const [message, setMessage] = React.useState("")
    const [resolvingToAddress, setResolvingToAddress] = React.useState(false)

    const [to, setTo] = React.useState("")

    const [sentTx, setSentTx] = React.useState(null)
    const onChangeToHandler = e => {
        setTo(e.target.value);
    };

    const [sentSuccessfully, setSentSuccessfully] = React.useState(false)
    const [isSending, setIsSending] = React.useState(false)
    const [toAccount, setToAccount] = React.useState(null)
    const [domainOwnerAddress, setDomainOwnerAddress] = React.useState(null)
    const [showWarning, setShowWarning] = React.useState(false)
    const [selectedFromDomain, setSelectedFromDomain] = React.useState(null)
    React.useEffect(() => {
        setResolvingToAddress(to.endsWith(".neo") && toAccount === null)
    }, [toAccount])

    React.useEffect(() => {
        if (to.endsWith(".neo")) {
            checkInboxPublicKeyOnNeoNS(to)
        } else {
            setDomainOwnerAddress(null)
            setToAccount(null)
        }
    }, [to])

    React.useEffect(() => {
        console.log(accountContext.domains)
        if (accountContext.domains === undefined || accountContext.domains === null || accountContext.domains.length === 0) {
            return
        }

        setSelectedFromDomain(accountContext.domains[0].domain)
    }, [accountContext.domains])

    const checkInboxPublicKeyOnNeoNS = async (domain) => {
        const node = "https://n3seed1.ngd.network:10332/"

        //0. check if there is an owner of a given domain.
        let ownerAddress = await neons.ownerOf(node, domain)

        if (ownerAddress) {
            setDomainOwnerAddress(ownerAddress)
        } else {
            //if we don't find an owner of this domain then we just stop here.
            return
        }

        //1. try to get records from NeoNS
        //2. Check if there is "inbox.publickey" in TEXT(16) record
        //3. Convert public key to Neo N3 address by using Neon.create.Account([publicKey])
        //4. show address
        let records = await neons.getAllRecords(node, domain)

        let inboxPublicKeyRecord = records.find((r) => { return r.name.startsWith("inbox.publickey") })

        if (inboxPublicKeyRecord) {
            let to = Neon.create.account(inboxPublicKeyRecord.value)
            if (to) {
                setToAccount(to)
            } else {
                setToAccount(null)
            }
        } else {
            setToAccount(null)
        }
    }

    const handleSend = async () => {
        setIsSending(true)

        //1. create a shared secret with toAccount.publicKey
        //2. Encrypt a message with shared secret
        //3. Send encrypted message along with a sender public key
        const nodeUrl = "https://n3seed1.ngd.network:10332/"

        console.log("toAccount", toAccount)
        let sharedSecret = crypto.CreateSharedSecret(accountContext.account.privateKey, toAccount.publicKey)
        let encrypted = crypto.Encrypt(message, sharedSecret)
        console.log(encrypted)
        console.log("from", accountContext.account.address)
        console.log("to", toAccount.address)


        let senderPublicKey = accountContext.account.publicKey
        const inboxProtocolStruct = {
            "text": encrypted,
            "publicKey": senderPublicKey,
            "protocol": "iep-0",
            "from.domain": selectedFromDomain,
            "to.domain": to,
        }
        console.log(inboxProtocolStruct);

        //make prefix
        let prefixHex = Neon.u.str2hexstring("inbox")
        console.log(prefixHex);
        //add prefix to data field so we can catch it later.
        let data = prefixHex + Neon.u.str2hexstring(JSON.stringify(inboxProtocolStruct))

        console.log(data, accountContext.account);

        const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf'
        const networkMagic = Neon.CONST.MAGIC_NUMBER.MainNet
        const rpcAddress = nodeUrl
        const account = accountContext.account
        const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(GAS),
            {
                networkMagic,
                rpcAddress,
                account
            }
        )

        const amount = 14307
        const operation = "transfer"
        const params = [
            sc.ContractParam.hash160(accountContext.account.address),
            sc.ContractParam.hash160(toAccount.address),
            sc.ContractParam.integer(amount),
            sc.ContractParam.any(data)
        ]

        //TODO show sent dialog
        let result;
        try {
            const txHash = await contract.invoke(operation, params);
            setSentSuccessfully(true)
            setSentTx(txHash)
        } catch (e) {
            console.log(e);
            setIsSending(false)
            setSentSuccessfully(false)
            setSentTx(null)
        }
    }


    const onChangeFromDomain = (e) => {
        const selected = e.target.value
        console.log(selected)
    }

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar showBackButton={true} title="Inbox" />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="text-xl font-semibold px-4 pt-4 flex items-center gap-2">
                    <PencilIcon className="w-5 h-5" />
                    <span>Compose</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <div>
                        <p className="font-medium mb-1">From</p>
                        <div className="">
                            <select className="font-semibold w-full p-0 m-0 focus:outline-none focus:ring-0" defaultValue={selectedFromDomain} onChange={(e) => onChangeFromDomain(e)}>
                                {
                                    accountContext.domains.map((d) => (
                                        <option className="p-0" value={d.domain} key={d.domain}>{d.domain}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium mb-1">To <span className="">{toAccount && toAccount.address}</span></p>
                        <div className="flex items-center p-2 w-full border border-black">
                            <input onChange={onChangeToHandler} type="text" className="w-full appearance-none focus:outline-none" />
                            <div className="ml-auto">
                                {
                                    to.endsWith(".neo") && resolvingToAddress == true && domainOwnerAddress === null && toAccount === null ?
                                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        : null
                                }


                                {
                                    to.endsWith(".neo") && resolvingToAddress == false && domainOwnerAddress !== null && toAccount !== null ?
                                        <CheckIcon className="text-green-500 w-5 h-5" />
                                        :
                                        null
                                }

                                {/* //when we found an owner of the domain but no "inbox.publickey" record in NeoNS */}
                                {
                                    to.endsWith(".neo") && resolvingToAddress == false && domainOwnerAddress !== null && toAccount === null ?

                                        <>
                                            <ExclamationTriangleIcon onClick={(e) => setShowWarning(!showWarning)} className="text-yellow-500 w-5 h-5 cursor-pointer" />


                                            <InboxDialog isPresented={showWarning} setIsPresented={setShowWarning}>
                                                <p >Found an owner of this domain. However, the owner doesn't set up Inbox Protocol to receive encrypted message yet.</p>
                                            </InboxDialog>

                                        </>

                                        :
                                        null
                                }



                                {
                                    to.endsWith(".neo") && resolvingToAddress == false && domainOwnerAddress === null && toAccount === null ?
                                        <XMarkIcon className="text-red-500 w-5 h-5" />
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <p className="font-medium mb-1">Message</p>
                        <textarea onChange={(e) => { setMessage(e.target.value) }} rows={6} className="p-2 w-full border border-black appearance-none focus:outline-none" />
                        <p className={`text-xs ${message.length > MAX_MESSAGE_CHARACTER ? "text-red-500" : ""}`}>{MAX_MESSAGE_CHARACTER - message.length} characters left</p>
                    </div>
                    <button disabled={toAccount === null || message.length == 0} onClick={(e => { handleSend(e) })} className="mt-4 w-full bg-black text-white font-semibold p-2 disabled:bg-opacity-25">Send</button>
                    <div className="text-xs flex items-center gap-1">
                        <LockClosedIcon className="w-3 h-3" />
                        <span>Your message is encrypted</span>
                    </div>
                </div>
            </div>
            {/* <BottomNavbar /> */}
            <Transition show={isSending} as={React.Fragment}>
                <Dialog onClose={() => { setIsSending(false); navigate(-1); }} className>

                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed top-0 left-0 inset-0 bg-black/80" />
                    </Transition.Child>


                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 flex items-center justify-center">
                            <Dialog.Panel className="w-full max-w-sm bg-white p-4">

                                {
                                    sentSuccessfully === true ?
                                        <div className=" flex flex-col">
                                            <div className="mb-2 mx-auto">
                                                <LockClosedIcon className="w-12 h-12 text-green-500" />
                                            </div>
                                            <div className="mb-4">Your encrypted message has been sent to <span className="font-semibold">{to}</span></div>

                                            <a  href={`https://dora.coz.io/transaction/neo3/mainnet/${sentTx}`} target="_blank" className="text-xs flex items-center"><span>View on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3" /></a>
                                            <button onClick={(e) => { navigate(-1) }} className="w-full mt-4 py-2 bg-black text-white font-semibold">Close</button>
                                        </div>
                                        :
                                        <div className=" flex flex-col items-center justify-center">
                                            <div className="mb-4">
                                                <svg className="animate-spin h-12 w-12 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                            <div className="font-semibold">Sending...</div>
                                        </div>
                                }

                            </Dialog.Panel>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </div>
    )
}