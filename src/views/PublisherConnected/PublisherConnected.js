import React from "react"
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { Link, useNavigate } from "react-router-dom"

export default function PublisherConnected(props) {

    const navigate = useNavigate();
    const [isAgreedToTerm, setIsAgreedToTerm] = React.useState(false)

    return (
        <div className="absolute inset-0 flex flex-col w-full h-full">
            <div className="container mx-auto flex items-center justify-center h-full">
                <div className="">
                    <div className="mb-4 flex flex-col ">
                        <p className="text-4xl font-bold">Inbox</p>
                        <p className="font-semibold"></p>
                    </div>
                    <div className="mb-4 flex flex-col ">
                        <p className="font-semibold">Your address</p>
                        <p className="text-xl font-semibold">NV96QgerjXNmu4jLdMW4ZWkhySVMYX52Ex</p>
                    </div>
                    <p className="mb-4 font-medium">To become a publisher,
                        You are required to stake 10 GAS to the Inbox smart contract.
                        You can withdraw your GAS at anytime</p>
                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input onChange={(e) => { setIsAgreedToTerm(e.target.checked) }} type="checkbox" className=" w-6 h-6 bg-white border-black border-2 accent-black" /><span>I got it</span>
                        </label>
                    </div>
                    <button onClick={(e) => { navigate("/publisher") }} disabled={!isAgreedToTerm} className="disabled:bg-opacity-50 mb-2 p-4 bg-black text-white font-semibold">Sign up as a Publisher</button>
                    <p className="text-sm">You will be asked to sign a transaction with your Wallet via WalletConnect</p>
                </div>
            </div>
        </div>
    )
}