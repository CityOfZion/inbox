import React from "react"

import { useParams } from "react-router-dom"
import { Link, useNavigate } from "react-router-dom"
import { default as Neon, sc } from "@cityofzion/neon-js";
import * as neons from '../../services/neons'
import { useAccountContext } from "../../contexts/AccountContext";
import TopNavbar from "../Shared/TopNavbar"
import { GlobeAltIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import InboxDialog from '../Components/InboxDialog'
import { CheckCircleIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Post(props) {
    const accountContext = useAccountContext()
    const navigate = useNavigate();

    const MAX_MESSAGE_CHARACTER = 200
    const [message, setMessage] = React.useState("")

    const [postStatus, setPostStatus] = React.useState(null)
    const [isDialogPresented, setIsDialogPresented] = React.useState(false)
    const [sentTx, setSentTx] = React.useState(null)

    const handlePost = async (e) => {
        setIsDialogPresented(true)
        setPostStatus(null)

        const text = message
        const nodeUrl = "https://n3seed1.ngd.network:10332/"

        //0. Posting on the timeline means that we attach a data into a transacdtion when sending to self

        let senderPublicKey = accountContext.account.publicKey
        const publicMessageInboxProtocolStruct = {
            "text": text,
            "publicKey": senderPublicKey,
            "protocol": "iep-1",
        }

        //make prefix
        let prefixHex = Neon.u.str2hexstring("inbox.public")

        //add prefix to data field so we can catch it later.
        let data = prefixHex + Neon.u.str2hexstring(JSON.stringify(publicMessageInboxProtocolStruct))

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
            sc.ContractParam.hash160(accountContext.account.address), //from
            sc.ContractParam.hash160(accountContext.account.address), //to
            sc.ContractParam.integer(amount),
            sc.ContractParam.any(data)
        ]

        let result;
        try {
            const txHash = await contract.invoke(operation, params);
            setPostStatus("success")
            setMessage("")
            setSentTx(txHash)
        } catch (e) {
            setPostStatus("error")
            setMessage("")
            setSentTx(null)
        }
    }

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black h-full">
            <TopNavbar showBackButton={true} title="Inbox" />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="text-xl font-semibold px-4 pt-4 flex items-center gap-2">
                    <PencilSquareIcon className="w-5 h-5" />
                    <span>Post</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <div>
                        <p className="font-medium mb-1">Message</p>
                        <textarea value={message} onChange={(e) => { setMessage(e.target.value) }} rows={6} className="p-2 w-full border border-black appearance-none focus:outline-none" />
                        <p className={`text-xs ${message.length > MAX_MESSAGE_CHARACTER ? "text-red-500" : ""}`}>{MAX_MESSAGE_CHARACTER - message.length} characters left</p>
                    </div>

                    <button disabled={message.length == 0} onClick={(e => { handlePost(e) })} className="mt-4 w-full bg-black text-white font-semibold p-2 disabled:bg-opacity-25">Post</button>
                    <div className="text-xs flex items-center gap-1">
                        <GlobeAltIcon className="w-3 h-3" />
                        <span>Your message is public</span>
                    </div>

                </div>
            </div>

            <InboxDialog isPresented={isDialogPresented} setIsPresented={setIsDialogPresented}>
                <div className="flex flex-col items-center justify-center gap-2">
                {
                        postStatus === "error" ?
                            <>
                                <XMarkIcon className="text-red-500 w-12 h-12" />
                                <p>Uh oh, Something went wrong</p>
                                <button onClick={(e) => { navigate(-1) }} className="w-full mt-4 py-2 bg-black text-white font-semibold">Close</button>
                            </>
                            : null
                    }
                    {
                        postStatus === "success" ?
                            <>
                                <CheckCircleIcon className="text-green-500 w-12 h-12" />
                                <p>Post successfully</p>
                                <a href={`https://dora.coz.io/transaction/neo3/mainnet/${sentTx}`} target="_blank" className="text-xs flex items-center"><span>View on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3" /></a>
                                <button onClick={(e) => { navigate(-1) }} className="w-full mt-4 py-2 bg-black text-white font-semibold">Close</button>
                            </>
                            : null
                    }
                    {
                        postStatus === null ?
                            <>
                                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p>Posting your message</p>
                            </>
                            : null
                    }

                </div>
            </InboxDialog>

        </div>
    )

}