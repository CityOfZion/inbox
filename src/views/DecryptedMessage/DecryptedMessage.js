import React from "react"


import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { useParams } from "react-router-dom"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { LockOpenIcon } from "@heroicons/react/24/outline"
export default function DecryptedMessage(props) {
    const { publisherId, messageId } = useParams()
    
    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <TopNavbar title={publisherId} showBackButton={true} />
            <div className=" flex flex-col divide-y divide-black overflow-y-auto w-full">
                <div className="p-4 flex items-center gap-4 ">
                    <div className="">
                        <div className="mb-2 text-sm font-medium flex items-center gap-2">
                            <LockOpenIcon className="w-5 h-5" />
                            <span>Yesterday</span>
                        </div>
                        <div className="">Text has been decrypted and it will show just like this. Message is limit to 100 characters.</div>
                    </div>
                    
                </div>
            </div>
            <div className="mt-auto px-4 flex flex-col gap-4">
                
                <div className="border-t-4 border-black flex flex-col divide-y divide-black">
                    <div className="flex items-center py-4">
                        <p>Claimed</p>
                        <p className="ml-auto font-bold">0.2 GAS</p>
                    </div>
                    <div className="flex items-start py-4">
                        <p className="">Transaction ID</p>
                        <div className="ml-auto text-right">
                            <p>0xa36c...84c7</p>
                            <a href="" target="_blank" className="text-xs flex items-center"><span>View on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3"/></a>
                        </div>
                    </div>
                    <div className="flex items-start py-4">
                        <p className="">Claimed Transaction ID</p>
                        <div className="ml-auto text-right">
                            <p>0xc847...ac63</p>
                            <a href="" target="_blank" className="text-xs flex items-center"><span>View on block explorer</span><ArrowTopRightOnSquareIcon className="ml-1 w-3 h-3"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}