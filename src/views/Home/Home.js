import React from "react"

import PublisherRow from './PublisherRow'
import { ChevronRightIcon, CogIcon, InboxArrowDownIcon, PencilIcon, PlusIcon, UserIcon } from '@heroicons/react/24/solid'
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { Link } from 'react-router-dom'
import MessageTransactionRow from "./MessageTransactionRow"
import { useAccountContext } from "../../contexts/AccountContext";
import { default as Neon } from "@cityofzion/neon-js";
import * as dora from "../../services/dora"

export default function Home(props) {

    const prefixHex = Neon.u.str2hexstring("inbox")
    const accountContext = useAccountContext()
    const account = accountContext.account
    const [inboxTxs, setInboxTxs] = React.useState([])

    const loadInboxTransaction = async () => {

        //0. get all transactions of this account
        const result = await dora.transactions(account.address)

        if (result.length === 0) {
            return
        }

        //1. Filter only transactions that are prefixed with definded text(protocol) "inbox" 
        const filtered = result.items.filter((t) => {
            const invocation = t.invocations[0]
            return invocation.metadata.data && invocation.metadata.data.startsWith(prefixHex)
        })


        //2. get from and to address from above transactions
        var addresses = []
        filtered.map((t) => {
            const invocation = t.invocations[0]
            const data = invocation.metadata.data

            const fromAddress = invocation.metadata.from
            const toAddress = invocation.metadata.to


            if (addresses.includes(fromAddress) === false) {
                addresses.push(fromAddress)
            }

            if (addresses.includes(toAddress) === false) {
                addresses.push(toAddress)
            }
        })

        setInboxTxs(filtered)
    }
    React.useEffect(() => {
        loadInboxTransaction()
    }, [])

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title="Inbox" />

            <div className="flex-1 relative overflow-y-auto">

                <div className=" flex flex-col divide-y divide-black">
                    {
                        inboxTxs.map((tx) => (
                            <MessageTransactionRow key={tx.hash} tx={tx} />
                        ))
                    }
                </div>
            </div>
            <div className="absolute bottom-20 right-0 z-50 p-4">
                <Link to="/compose" className="rounded-full bg-black text-white w-12 h-12 flex items-center justify-center shadow-lg transition ease-in-out delay-150 hover:scale-110">
                    <PencilIcon className="w-6 h-6" />
                </Link>
            </div>
            <BottomNavbar />
        </div>
    )
}