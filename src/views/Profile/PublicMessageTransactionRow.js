import React from "react"
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ChevronRightIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { Link } from "react-router-dom"
import { useAccountContext } from "../../contexts/AccountContext";

import { default as Neon } from "@cityofzion/neon-js";

export default function PublicMessageTransactionRow(props) {


    const accountContext = useAccountContext()
    const account = accountContext.account

    const { tx } = props

    const invocation = tx.invocations[0]

    const parseInboxData = (hexData) => {
        const prefixHex = Neon.u.str2hexstring("inbox.public")
        //ignore if data is not prefixed with "inbox"
        if (hexData.startsWith(prefixHex) == false) {
            return null
        }

        const inboxJsonHex = hexData.substring(prefixHex.length)
        const jsonString = Neon.u.hexstring2str(inboxJsonHex)
        const inboxData = JSON.parse(jsonString)
        console.log(inboxData)
        return inboxData
    }

    const [parsedData, setParsedData] = React.useState(parseInboxData(invocation.metadata.data))

    const truncateMiddle = (string) => {
        return `${string.substring(0, 4)}...${string.substring((string.length - 4))}`
    }

    return (
        <div className="p-4 flex items-center">
            <div className="flex items-center gap-3">

                <div>
                    <p className="mb-1">
                        {parsedData.text}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(tx.time * 1000))}
                        &nbsp;·&nbsp;
                        <a href={`https://dora.coz.io/transaction/neo3/mainnet/${tx.hash}`} target="_blank">{truncateMiddle(tx.hash)}</a>
                    </p>
                </div>
            </div>
            <div className="ml-auto">

            </div>
        </div>
    )
}