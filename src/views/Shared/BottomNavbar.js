import React from "react"
import { Link } from 'react-router-dom'
import { CogIcon, InboxArrowDownIcon, UserIcon } from '@heroicons/react/24/solid'
export default function BottomNavbar(props) {

    return (
        <div className="mt-auto sticky bottom-0 border-t border-black flex items-center justify-between gap-8 p-4 bg-white">
            <Link to="/" className={`flex flex-col items-center w-full gap-0.5 ${window.location.pathname.endsWith("/") || window.location.pathname.includes("/inbox/") ? "opacity-100" : "opacity-30 hover:opacity-50"} `}>
                <InboxArrowDownIcon className="w-6 h-6" />
                <p className="text-xs">Inbox</p>
            </Link>
            <Link to="/account" className={`flex flex-col items-center w-full gap-0.5 ${window.location.pathname.endsWith("/account") ? "opacity-100" : "opacity-30 hover:opacity-50"} `}>
                <UserIcon className="w-6 h-6" />
                <p className="text-xs">Account</p>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center w-full gap-0.5  ${window.location.pathname.endsWith("/settings") ? "opacity-100" : "opacity-30 hover:opacity-50"} `}>
                <CogIcon className="w-6 h-6" />
                <p className="text-xs">Setting</p>
            </Link>
        </div>
    )
}