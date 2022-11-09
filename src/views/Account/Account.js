import React from "react"
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import QRCode from "react-qr-code";
import { useAccountContext } from "../../contexts/AccountContext";
import { ArrowRightIcon, InboxArrowDownIcon } from "@heroicons/react/24/solid";
import * as dora from "../../services/dora"
import * as neons from "../../services/neons"
import { Link } from "react-router-dom"
export default function Account(props) {
    const accountContext = useAccountContext()
    const account = accountContext.account

    const [balance, setBalance] = React.useState([])

    const fetchBalance = React.useCallback(async () => {
        const response = await dora.balance(account.address)
        setBalance(response)
    })
    React.useEffect(() => {
        fetchBalance()
    }, [])


    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title="Account" />
            <div className="flex-1 flex flex-col overflow-y-auto pt-6">
                <div className="flex flex-col justify-center px-4">
                    <div className="flex items-center justify-center relative">
                        <QRCode size={160} value={account.address} />
                        <div className="absolute bg-white rounded-lg p-1 border-4 border-black"><InboxArrowDownIcon className="w-8 h-8" /></div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs">Address</p>
                        <p className="text-sm break-all font-semibold">{account.address}</p>
                        <p className="text-xs mt-2">Public key</p>
                        <p className="text-sm break-all font-semibold">{account.publicKey}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full mt-6">
                    <p className="p-3 font-bold">Balance</p>
                    <div className="flex flex-col w-full divide-y divide-black border-t border-b border-black">
                        {
                            balance.map((b) => (
                                <div key={b.symbol} className="flex items-center w-full text-left p-3">
                                    <div>
                                        <p className="font-medium leading-none mb-0.5">{b.symbol}</p>
                                        <p className="text-xs">{b.asset_name}</p>
                                    </div>
                                    <div className="ml-auto text-right">{b.balance}</div>
                                </div>
                            ))
                        }
                        {
                            balance.length === 0 ?
                                <div className="p-3">No balance</div>
                                : null
                        }
                    </div>
                </div>
                <div className="flex flex-col w-full mt-6">
                    <p className="p-3 font-bold">NeoNS Domains</p>
                    <div className="flex flex-col w-full divide-y divide-black border-t border-b border-black">
                        {
                            accountContext.domains.map((d) => (
                                <div key={d.domain} className="flex items-center w-full text-left p-3">
                                    <div>
                                        <p className="font-medium leading-none mb-0.5">{d.domain}</p>
                                        <p className="text-xs">
                                            Expires at {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d.expiration))}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        {d.records.filter((r) => { return r.name.startsWith("inbox.publickey") }).length > 0 ?
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-green-600 w-6 h-6">
                                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                                            </svg>
                                            : null
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        {
                            accountContext.domains.length === 0 ?
                                <div className="p-3">
                                    <p>You don't have any domain on NeoNS.</p>
                                    <a href="https://neo.link" target="_blank" className="font-medium underline">Learn more about NeoNS →</a>
                                </div>
                                : null
                        }

                    </div>
                    <div className="p-3 w-full">
                        {
                            accountContext.domains.length > 0 ?
                                <Link to="/register" className="p-3 bg-black text-white font-semibold w-full flex items-start">
                                    Register your public key
                                    <ArrowRightIcon className="ml-auto w-5 h-5" />
                                </Link>
                                : null
                        }
                    </div>
                </div>
            </div>
            <BottomNavbar />
        </div>
    )
}