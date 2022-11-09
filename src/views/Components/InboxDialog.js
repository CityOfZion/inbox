import { Dialog, Transition } from '@headlessui/react'
import React from "react"


export default function InboxDialog(props) {

    const { isPresented, setIsPresented } = props

    return (
        <Transition show={isPresented} as={React.Fragment}>
            <Dialog onClose={() => setIsPresented(false)} className>

                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed top-0 left-0 inset-0 bg-black/80" />
                </Transition.Child>


                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="fixed inset-0 flex items-center justify-center">
                        <Dialog.Panel className="w-full max-w-sm bg-black text-white p-4">
                            {props.children}

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )

}