import React from "react"
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, ExclamationTriangleIcon, LockClosedIcon, PencilIcon, ShieldCheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TopNavbar from "../Shared/TopNavbar"
import * as neons from '../../services/neons'
import { useAccountContext } from "../../contexts/AccountContext";
import { default as Neon, sc } from "@cityofzion/neon-js";
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from "react-router-dom"
export default function Register(props) {

    const navigate = useNavigate();
    const accountContext = useAccountContext()
    const account = accountContext.account
    const [selectedDomain, setSelectedDomain] = React.useState(null)
    const [successTxId, setSuccessTxId] = React.useState(null)
    const registerPublicKey = async () => {

        if (selectedDomain === null) {
            return
        }
        const nodeUrl = "https://n3seed1.ngd.network:10332/"
        const contractHash = neons.NeoNSMainnetContract
        const networkMagic = Neon.CONST.MAGIC_NUMBER.MainNet
        const rpcAddress = nodeUrl
        const account = accountContext.account
        const contract = new Neon.experimental.SmartContract(Neon.u.HexString.fromHex(contractHash),
            {
                networkMagic,
                rpcAddress,
                account
            }
        )

        const operation = "setRecord"
        const params = [
            sc.ContractParam.string("inbox.publickey." + selectedDomain),
            sc.ContractParam.integer("16"),
            sc.ContractParam.string(account.publicKey),
        ]

        let result;
        try {
            const txHash = await contract.invoke(operation, params);
            setSuccessTxId(txHash)
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar showBackButton={true} title="Register" />

            <div className="flex flex-col items-center justify-center w-full ">
                <div className="p-8">
                    <p className="text-2xl font-bold">Register public key</p>
                    <p>Start receiving encrypted messages by registering your public key on NeoNS.</p>
                    <p> Inbox uses <a target="_blank" className="underline " href="https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman">ECDH</a> key agreement protocol and NeoNS as a public key server.</p>

                    <div className="mt-4">
                        <p className="text-xs">Address</p>
                        <p className="text-sm break-all font-semibold">{account.address}</p>
                        <p className="text-xs mt-2">Public key</p>
                        <p className="text-sm break-all font-semibold">{account.publicKey}</p>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <p className="px-8 py-4 font-bold">NeoNS Domains</p>
                    <div className="flex flex-col divide-y border-t border-black">
                        {
                            accountContext.domains.map((d) => (
                                <label htmlFor={d.domain} key={d.domain} className="flex items-center w-full text-left px-8 py-4 border-b border-black gap-4 ">
                                    <div>
                                        <input disabled={d.records.filter((r) => { return r.name.startsWith("inbox.publickey") }).length > 0} id={d.domain} onChange={(e) => { setSelectedDomain(d.domain) }} name="domain" type="radio" className="w-6 h-6 accent-black" value={d.domain} />
                                    </div>
                                    <div>
                                        <div className="font-medium leading-none mb-0.5">{d.domain}</div>
                                        <p className="text-xs">
                                            Expires at {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d.expiration))}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        {d.records.filter((r) => { return r.name.startsWith("inbox.publickey") }).length > 0 ?
                                            <p>Registered</p>
                                            : null
                                        }
                                    </div>
                                </label>
                            ))
                        }
                    </div>
                    <div className="mt-4 px-8">
                        <button disabled={selectedDomain === null} onClick={(e) => { registerPublicKey(e) }} className="disabled:bg-opacity-50 p-4 w-full bg-black text-white font-semibold">Register public key</button>
                    </div>
                </div>


            </div>



            <Transition show={successTxId !== null} as={React.Fragment}>
                <Dialog onClose={() => { navigate(-1); }} className>

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

                                <div className=" flex flex-col">
                                    <div className="mb-2 mx-auto">
                                        <LockClosedIcon className="w-12 h-12 text-green-500" />
                                    </div>
                                    <div className="mb-4">Your public key has been added to {selectedDomain}. You are all set.</div>

                                    <a href={`https://dora.coz.io/transaction/neo3/mainnet/${successTxId}`} target="_blank" className="text-xs flex items-center"><span>View transaction on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3" /></a>
                                    <button onClick={(e) => { navigate(-1) }} className="w-full mt-4 py-2 bg-black text-white font-semibold">Close</button>
                                </div>

                            </Dialog.Panel>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>


        </div>
    )
}