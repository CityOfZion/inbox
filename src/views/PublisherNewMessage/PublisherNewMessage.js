import React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ArrowTopRightOnSquareIcon, PlusIcon, WifiIcon } from '@heroicons/react/24/solid'

import { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { Link, useNavigate } from "react-router-dom"

export default function PublisherNewMessage(props) {

    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom-start',
    })

    const MAX_MESSAGE_CHARACTER = 100

    const [isAgreedToTerm, setIsAgreedToTerm] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const navigate = useNavigate();
    const [numberOfSubscribers, setNumberOfSubscribers] = React.useState(4017)
    const [amountPerSubscriber, setAmountPerSubscriber] = React.useState(0)

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
                <div className="container mx-auto h-full w-full border-l border-r border-black">
                    <div className="p-4">
                        <button onClick={(e) => { navigate(-1) }} className="flex items-center">
                            <ChevronLeftIcon className="w-6 h-6" /><span>Back</span>
                        </button>
                    </div>
                    <div className="p-4 flex gap-8 ">
                        {/* left column */}
                        <div className="w-2/3">
                            <p className="text-lg font-bold mb-4">New Message</p>
                            <div className="flex flex-col">
                                <input type="text" className="mb-4 rounded w-full border border-black h-12 px-4 focus:outline-black" placeholder="Subject" />
                                <textarea onChange={(e)=>{setMessage(e.target.value)}} rows={6} className="mb-2 rounded w-full border border-black p-4 focus:outline-black" placeholder="Message..." />
                                <p className={`text-xs ${message.length > MAX_MESSAGE_CHARACTER ? "text-red-500" : ""}`}>{MAX_MESSAGE_CHARACTER - message.length} characters left</p>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <label>
                                    <p className="mb-2">Asset to send</p>
                                    <select className="h-12 border border-black rounded px-2 py-2 w-full focus:outline-black pr-4">
                                        <option>GAS</option>
                                    </select>
                                </label>
                                <label>
                                    <p className="mb-2">Amount per subscriber</p>
                                    <input onChange={(e)=>{setAmountPerSubscriber(e.target.value)}} type="number" min={0} step="0.01" className="rounded w-full border border-black h-12 px-4 focus:outline-black text-right" placeholder="0.1" />
                                </label>
                            </div>
                            <div className="mt-8 mb-4">
                                <label className="flex items-center gap-2">
                                    <input onChange={(e) => { setIsAgreedToTerm(e.target.checked) }} type="checkbox" className="w-6 h-6 bg-white border-black border-2 accent-black" /><span>I doubled check that everything is correct</span>
                                </label>
                            </div>
                            <div className="">
                            <button onClick={(e)=>{navigate("/publisher")}} disabled={!isAgreedToTerm} className="disabled:bg-opacity-50 mb-2 p-4 px-8 bg-black text-white font-semibold">Send</button>
                                <p className="text-sm">You will be asked to sign a transaction with your Wallet via WalletConnect</p>
                            </div>
                        </div>
                        {/* ends left column */}
                        {/* right column */}
                        <div className="w-1/3 flex-none">
                            <div className="border border-black p-4 flex flex-col gap-2">
                                <div>
                                    <p className="text-sm">Channel</p>
                                    <p className="text-lg font-semibold">General</p>
                                </div>
                                <div>
                                    <p className="text-sm">Subscribers</p>
                                    <p className="text-lg font-semibold">{numberOfSubscribers.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm">Amount to spend</p>
                                    {
                                     amountPerSubscriber > 0 ?
                                     <p className="text-lg font-semibold">{(numberOfSubscribers * amountPerSubscriber).toLocaleString()}  GAS</p>
                                     :
                                     <p className="text-lg font-semibold">0 GAS</p>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        {/* ends right column */}
                    </div>
                </div>
            </div>

        </div>
    )
}