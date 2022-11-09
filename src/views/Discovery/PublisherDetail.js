import React from "react"

import { ChevronRightIcon, CogIcon, InboxArrowDownIcon, SearchCircleIcon, SearchIcon, UserIcon } from '@heroicons/react/24/solid'
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { useParams } from "react-router-dom"
export default function PublisherDetail(props) {
    const { publisherId } = useParams()
    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title={`Publisher ${publisherId}`} showBackButton={true}  />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4">
                    <p className="font-bold text-xl">Publisher {publisherId}</p>
                    <p>https://publisher-{publisherId}-website.org</p>
                    <p className="mt-4">publisher {publisherId} detail text is here </p>
                </div>
                <div className="px-4">
                    <div className="border-t border-black"></div>
                </div>
                <div className="px-4 pt-4 flex items-center font-semibold">
                    <p>Cost</p>
                    <p className="ml-auto">2 GAS</p>
                </div>
                <div className="p-4">
                    <button className="w-full py-2 bg-black text-white font-semibold uppercase">Subscribe</button>
                    <p className="mt-2">Subscribe to receive message from this publisher require you to stake your GAS to the smart contract. You can get it back when unsubscribe.</p>
                </div>
            </div>
            {/* <BottomNavbar /> */}
        </div>
    )
}