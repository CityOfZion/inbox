import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid"
import React from "react"
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"

export default function Settings(props) {

    const signout = () => {
        localStorage.removeItem("_inbox_wif")
        window.location.href = "/"
    }
    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title="Settings" />
            <div className="flex-1 flex flex-col divide-y divide-black overflow-y-auto">
                <div className="flex flex-col w-full">
                    <button onClick={() => signout()} className="hover:bg-black hover:text-white flex items-center gap-2 w-full p-3 text-left border-b border-black font-medium">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Sign out</span>
                    </button>
                    <div className="p-3 text-sm">
                        Build: ed26c28
                    </div>
                </div>
            </div>
            <BottomNavbar />
        </div>
    )
}