import React from "react"

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { Link } from "react-router-dom"
export default function Discovery(props) {

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title="Discovery" />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="border-b border-black flex items-center w-full sticky top-0 bg-white">
                    <input type="text" className="w-full flex-1 px-4 h-12 focus:outline-none" placeholder="Search..." />
                    <div className="h-12 flex-none ml-auto flex items-center px-4 ">
                        <MagnifyingGlassIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {
                            [...Array(100).keys()].map((index) => (
                                <Link to={`/discovery/${index}`}>
                                    <div className="rounded-lg w-full h-40 border border-black p-4 hover:bg-black hover:text-white">
                                        <p className="font-semibold">Publisher {index}</p>
                                        {/* <p className="text-sm">Publisher {index}</p> */}
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <BottomNavbar />
        </div>
    )
}