import React from "react"
import { default as Neon } from "@cityofzion/neon-js";
import {
    useNavigate,
} from "react-router-dom";

export default function Welcome(props) {

    const [wif, setWif] = React.useState(null)
    const [isWif, setIsWif] = React.useState(false)
    const navigate = useNavigate();

    React.useEffect(() => {
        if (wif === null) {
            setIsWif(false)
            return
        }
        const valid = Neon.is.wif(wif);
        setIsWif(valid)
        if (valid) {
            console.log("wif", wif)
            localStorage.setItem("_inbox_wif", wif)
            window.location.reload()
        }
    }, [wif])

    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black">
            <div className="flex items-center justify-center h-full w-full p-8">
                <div>
                    <p className="text-2xl font-bold">Inbox</p>
                    <p>Welcome to Inbox, A simple, encrypted messaging service built on NEO. </p>
                    <p className="mt-4 mb-2">Get started by pasting your Neo N3 WIF here.</p>
                    <input onChange={(e) => setWif(e.target.value.trim())} type="text" placeholder="WIF" className="border border-black px-2 py-2 w-full focus:ring-1 focus:ring-black focus:outline-none" />
                    <p className="text-xs mt-1">Your private key is kept locally and is never sent to any server.</p>
                </div>
            </div>
        </div>
    )
}