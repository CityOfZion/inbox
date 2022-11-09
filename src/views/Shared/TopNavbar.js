import React from "react"
import { ChevronDownIcon, ChevronLeftIcon, CogIcon, InboxArrowDownIcon, UserIcon } from '@heroicons/react/24/solid'
import { useNavigate } from "react-router-dom"
import { useAccountContext } from "../../contexts/AccountContext";
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
export default function TopNavbar(props) {

    const accountContext = useAccountContext()
    const account = accountContext.account

    const { title, showBackButton } = props

    const navigate = useNavigate()

    let [referenceElement, setReferenceElement] = React.useState()
    let [popperElement, setPopperElement] = React.useState()
    let { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom-start',
    })

    return (
        <nav className="sticky top-0 flex-none flex items-center p-4 bg-white border-b border-black">
            <div className="text-xl font-bold flex-1 flex items-center truncate text-ellipsis ">
                {
                    showBackButton ?
                        <button onClick={(e) => (navigate(-1))}>
                            <ChevronLeftIcon className="w-6 h-6 -translate-x-2" />
                        </button>
                        : null
                }

                <p className="truncate text-ellipsis">{title}</p>
            </div>
            <div className="ml-auto text-right w-32 flex-none">
                <Popover>
                    <Popover.Button ref={setReferenceElement} className="focus:outline-none">
                        <div className="flex items-center gap-1 text-sm font-bold">
                            {
                                accountContext.domains.length > 0 ?
                                    accountContext.domains[0].domain
                                    : "Domain not found"
                            }
                            {
                                accountContext.domains.length > 1 ?
                                    <ChevronDownIcon className="w-4 h-4" />
                                    : null
                            }

                        </div>
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
                            {
                                accountContext.domains.map((d) => (
                                    <button key={d.domain} className="py-2 text-left">{d.domain}</button>
                                ))
                            }
                        </Popover.Panel>
                    </Transition>
                </Popover>

                <div className="font-semibold">
                </div>
                <p className="text-xs">{account.address.substring(0, 4)}...{account.address.substring((account.address.length - 4))}</p>
            </div>
        </nav>
    )
}