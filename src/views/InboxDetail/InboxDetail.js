import React from "react"
import { Link } from "react-router-dom"

import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { useParams } from "react-router-dom"
import { ChevronRightIcon, LockClosedIcon } from "@heroicons/react/24/solid"
import { LockOpenIcon } from "@heroicons/react/24/outline"
export default function InboxDetail(props) {
    const { tx } = useParams()
    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title="Message" showBackButton={true} />
            <div className="flex-1 flex flex-col divide-y divide-black overflow-y-auto w-full">
                
              
            </div>

        </div>
    )
}