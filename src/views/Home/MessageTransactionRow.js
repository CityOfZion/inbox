import React from "react"
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ChevronRightIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { Link } from "react-router-dom"
import { useAccountContext } from "../../contexts/AccountContext";

import { default as Neon } from "@cityofzion/neon-js";

export default function MessageTransactionRow(props) {


    const accountContext = useAccountContext()
    const account = accountContext.account

    const { tx } = props

    const invocation = tx.invocations[0]

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

    const [parsedData, setParsedData] = React.useState(parseInboxData(invocation.metadata.data))

    const truncateMiddle = (string) => {
        return `${string.substring(0, 4)}...${string.substring((string.length - 4))}`
    }

    return (
        <Link to={`/inbox/${invocation.metadata.from}/${tx.hash}`} className="p-4 flex items-center hover:bg-black hover:text-white">
            <div className="flex items-center gap-3">
                <div>
                    <div className="bg-black text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
                        {
                            account.address === invocation.metadata.from ?
                                <ArrowUpTrayIcon className="w-4 h-4" />
                                :
                                <ArrowDownTrayIcon className="w-4 h-4" />
                        }
                    </div>
                </div>
                <div>
                    <p className="font-medium">

                        {
                            account.address === invocation.metadata.from ?
                                <>{parsedData["to.domain"] !== undefined ? parsedData["to.domain"] + " · " : null} {truncateMiddle(invocation.metadata.to)}</>
                                :
                                <>{truncateMiddle(invocation.metadata.from)}</>
                        }
                    </p>
                    <p className="text-xs">
                        {
                            account.address === invocation.metadata.from ?
                                "Sent · "
                                :
                                "Received · "
                        }
                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(tx.time * 1000))}
                    </p>
                </div>
            </div>
            <div className="ml-auto">
                <ChevronRightIcon className="w-6 h-6" />
            </div>
        </Link>
    )
}