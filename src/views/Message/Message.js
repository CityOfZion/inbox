import React from "react"


import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { useParams } from "react-router-dom"
import { ArrowTopRightOnSquareIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid"
import { default as Neon } from "@cityofzion/neon-js";
import * as dora from "../../services/dora"
import * as crypto from '../../services/crypto'
import * as magnet from "../../services/magnet"
import { useAccountContext } from "../../contexts/AccountContext";
import * as neons from "../../services/neons"

export default function Message(props) {
    const { tx } = useParams()

    const accountContext = useAccountContext()
    const account = accountContext.account

    const [transaction, setTransaction] = React.useState(null)
    const [transactionData, setTransactionData] = React.useState(null)
    const [encryptedText, setEncryptedText] = React.useState(null)
    const [decryptedText, setDecryptedText] = React.useState(null)

    const [receiverPublicKey, setReceiverPublicKey] = React.useState(null) //we only need this when it's a sent message
    const [parsedData, setParsedData] = React.useState(null)

    const fetchTxDetail = async () => {
        const result = await dora.transactionDetail(tx)
        setTransaction(result)

        //because of dora transaction detail API doesn't return complete data about the transfer 
        //we have to fetch data using Magnet endpoint
        const r = await magnet.getTransferEventByTransactionHash(tx)

        let fromScriptHash = r.result.hexStringParams[0]
        let toScriptHash = r.result.hexStringParams[1]
        let dataInTransfer = r.result.hexStringParams[3]
        let txData = Neon.u.reverseHex(dataInTransfer)

        let from = Neon.create.account(fromScriptHash)
        let to = Neon.create.account(toScriptHash)

        setTransactionData({
            from: from.address,
            to: to.address,
            data: txData,
        })
        setParsedData(parseInboxData(txData))
    }

    React.useEffect(() => {
        fetchTxDetail()
    }, [])

    React.useEffect(() => {
        if (transactionData === null) {
            return
        }
        const parsed = parseInboxData(transactionData.data)
        setEncryptedText(parsed.text)

        gerReceiverDomainAndPublicKey()
    }, [transactionData])

    const gerReceiverDomainAndPublicKey = async () => {
        //if it's a sent message we then try to get public key of a receiver
        if (transactionData.from === account.address) {
            const domains = await magnet.getDomainsByAddress(transactionData.to)
            if (domains.length > 0) {
                let domain = domains[0].domain
                const node = "https://n3seed1.ngd.network:10332/"
                let records = await neons.getAllRecords(node, domain)
                let receiverInboxRecord = records.find((r) => { return r.name.startsWith("inbox.publickey") })
                setReceiverPublicKey(receiverInboxRecord.value)
            }
        }
    }

    const parseInboxData = (hexData) => {
        const prefixHex = Neon.u.str2hexstring("inbox")
        //ignore if data is not prefixed with "inbox"
        if (hexData.startsWith(prefixHex) == false) {
            return null
        }

        const inboxJsonHex = hexData.substring(prefixHex.length)
        const jsonString = Neon.u.hexstring2str(inboxJsonHex)
        const inboxData = JSON.parse(jsonString)
        return inboxData
    }

    const decryptInboxData = (hexData) => {

        const data = parseInboxData(hexData)

        //TODO: validating data 

        var publicKey = data.publicKey
        //it's a sent message
        if (transactionData.from === account.address) {
            publicKey = receiverPublicKey
        }
        const sharedSecret = crypto.CreateSharedSecret(account.privateKey, publicKey)
        const decrypted = crypto.Decrypt(data.text, sharedSecret)
        return decrypted
    }

    const truncateMiddle = (string) => {
        return `${string.substring(0, 4)}...${string.substring((string.length - 4))}`
    }

    const decryptData = () => {
        const decrypted = decryptInboxData(transactionData.data)
        if (decrypted !== null) {
            setDecryptedText(decrypted)
        }
    }

    const hideDecryptedText = () => {
        setDecryptedText(null)
    }

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title={tx} showBackButton={true} />
            <div className=" flex flex-col divide-y divide-black overflow-y-auto w-full">

                <div className="p-4 flex flex-col ">
                    <p className="text-xs">From</p>

                    <div>
                        <p className="font-medium">{parsedData && parsedData["from.domain"] !== undefined ? parsedData["from.domain"] : null}</p>
                        <p className="text-xs">{transactionData && transactionData.from}</p>
                    </div>
                </div>
                <div className="p-4 flex flex-col ">
                    <p className="text-xs">To</p>
                    <div>
                        <p className="font-medium">{parsedData && parsedData["to.domain"] !== undefined ? parsedData["to.domain"] : null}</p>
                        <p className="text-xs">{transactionData && transactionData.to}</p>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-4 ">
                    <div className="">
                        <div className="mb-2 text-sm font-medium flex items-center gap-2">
                            {
                                decryptedText !== null ?
                                    <LockOpenIcon className="w-5 h-5" />
                                    :
                                    <LockClosedIcon className="w-5 h-5" />
                            }

                            {
                                transaction !== null && transactionData !== null ?
                                    <span>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(transaction.time * 1000))}</span>
                                    : "Loading..."
                            }

                        </div>
                        {
                            decryptedText !== null ?
                                <div className="=">{decryptedText}</div>
                                :
                                encryptedText !== null ?
                                    <div className="break-all background-text">{encryptedText}</div>
                                    :
                                    "Loading..."
                        }




                    </div>

                </div>
            </div>
            <div className="mt-auto px-4 flex flex-col gap-4">
                {
                    transaction !== null && transactionData !== null ?
                        <button
                            className="noselect bg-black w-full py-2 text-white font-semibold "
                            onTouchStart={(e) => decryptData()}
                            onMouseDown={(e) => decryptData()}
                            onMouseUp={(e) => hideDecryptedText()}
                            onTouchEnd={(e) => hideDecryptedText()}
                        >Tap & hold to read the message</button>
                        :
                        "Loading..."
                }

                <div className="border-t-4 border-black flex flex-col divide-y divide-black">
                    <div className="flex items-start py-4">
                        <p className="">Transaction ID</p>
                        <div className="ml-auto text-right">
                            <p>{truncateMiddle(tx)}</p>
                            <a href={`https://dora.coz.io/transaction/neo3/mainnet/${tx}`} target="_blank" className="text-xs flex items-center"><span>View on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}