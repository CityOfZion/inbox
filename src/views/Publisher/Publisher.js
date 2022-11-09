import React from "react"
import { ChevronDownIcon, ChevronRightIcon, ArrowTopRightOnSquareIcon, PlusIcon, WifiIcon } from '@heroicons/react/24/solid'

import { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { Link, useNavigate } from "react-router-dom"

export default function Publisher(props) {

    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom-start',
    })

    const navigate = useNavigate();

    return (

        <div className="absolute inset-0 flex flex-col w-full h-full">
            <nav className="w-full border-b border-black">
                <div className="p-4 flex items-center container mx-auto border-r border-l border-black">
                    <div>
                        <p className="text-lg font-bold">Inbox</p>
                    </div>
                    <div className="ml-auto">
                        <div className="flex items-center">
                            <WifiIcon className="w-4 h-4 mr-1" /><span>You are connected</span>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="border-b border-black z-50">
                <div className="container mx-auto flex items-center p-4  border-l border-r border-black">
                    <div>
                        <Popover>
                            <Popover.Button ref={setReferenceElement} className="focus:outline-none">
                                <div className="flex items-center gap-1 text-lg font-bold">Business.neo<ChevronDownIcon className="w-4 h-4" /></div>
                            </Popover.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Popover.Panel
                                    ref={setPopperElement}
                                    style={styles.popper}
                                    {...attributes.popper}
                                    className="px-4 bg-white border shadow flex flex-col divide-y z-50"
                                >
                                    <button className="py-2 text-left">AnotherName.neo</button>
                                    <button className="py-2 text-left">Apisit.neo</button>
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                        <div className="text-sm">NSiVJYZej4XsxG5CUpdwn7VRQk8iiiDMPM</div>
                    </div>
                    <div className="ml-auto">

                    </div>
                </div>
            </div>
            <div className="h-full overflow-hidden">
                <div className="container mx-auto flex items-start h-full w-full border-l border-r border-black">
                    {/* channel panel */}
                    <div className="w-60 flex-none  border-r border-black h-full overflow-y-auto">
                        <div className="p-4 flex items-center border-b border-black sticky top-0 bg-white">
                            <p className="font-bold">Channels</p>
                            <button className="ml-auto flex items-center gap-1 bg-black text-white px-2 py-1 hover:-translate-y-1 transition ease-in-out delay-100">
                                <PlusIcon className="w-4 h-4" /><span>New</span>
                            </button>
                        </div>
                        <div className="flex flex-col divide-y divide-black">
                            {
                                [...Array(100).keys()].map((index) => (
                                    <div className="flex items-center p-4 hover:bg-black hover:text-white hover:cursor-pointer">
                                        <div className="">
                                            <p className="font-semibold">Default Channel {index}</p>
                                            <p className="text-xs">{Math.floor(Math.random() * 2041)} subscribers</p>
                                        </div>
                                        <div className="ml-auto">
                                            <button><ChevronRightIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                    </div>
                    {/* ends channel panel */}
                    {/* message panel */}
                    <div className="w-64 flex-none  border-r border-black h-full overflow-y-auto">
                        <div className="p-4 flex items-center border-b border-black sticky top-0 bg-white">
                            <p className="font-bold">Messages</p>
                            <button onClick={(e) => { navigate("/publisher/send") }} className="ml-auto flex items-center gap-1 bg-black text-white px-2 py-1 hover:-translate-y-1 transition ease-in-out delay-100">
                                <PlusIcon className="w-4 h-4" /><span>New</span>
                            </button>
                        </div>
                        <div className="flex flex-col divide-y divide-black">
                            {
                                [...Array(100).keys()].map((index) => (
                                    <div className="flex items-center p-4 hover:bg-black hover:text-white hover:cursor-pointer">
                                        <div className="flex-0 truncate overflow-ellipsis">
                                            <p className="font-semibold">This is a subject {index}</p>
                                            <p className="text-xs truncate overflow-ellipsis">A long long message which will be clamped</p>
                                        </div>
                                        <div className="flex-none ml-auto flex items-center">
                                            <p className="text-xs">1d</p>
                                            <button><ChevronRightIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                    </div>
                    {/* ends message panel */}
                    {/* message detail section */}
                    <div className="flex-1 h-full">
                        <div className="flex gap-4 items-center">

                            <div className="p-4">
                                <p className=" leading-none">Sent</p>
                                <p className="text-xl font-bold">2,028</p>
                            </div>

                            <div className="p-4">
                                <p className=" leading-none">Read & Claimed</p>
                                <p className="text-xl font-bold">2,028</p>
                            </div>

                            <div className="p-4">
                                <p className=" leading-none">Cost</p>
                                <p className="text-xl font-bold">5.23 GAS</p>
                            </div>
                            <div className="ml-auto p-4">
                                <button className="flex flex-col">
                                    <p className="text-sm flex items-center gap-1">View on block explorer<ArrowTopRightOnSquareIcon className="w-4 h-4" /></p>
                                    <p className="text-xs">0x37c7...7853</p>

                                </button>
                            </div>
                        </div>
                        <div className="px-4">
                            <hr className=" border-black border-2" />
                        </div>
                        <div className="p-4">
                            <p className="font-semibold">This is a subject line</p>
                            <p className="">This is a message that was sent to users</p>
                        </div>
                    </div>
                    {/* ends message detail section */}
                </div>
            </div>

        </div>
    )
}