import React from "react"
import BottomNavbar from "../Shared/BottomNavbar"
import TopNavbar from "../Shared/TopNavbar"
import { Link, useNavigate } from "react-router-dom"
export default function PublisherRegister(props) {

    const navigate = useNavigate();

    return (
        <div className="absolute inset-0 flex flex-col w-full h-full">
            <div className="container mx-auto flex items-center justify-center h-full">
                <div className="">
                    <div className="mb-4 flex flex-col ">
                        <p className="text-4xl font-bold">Inbox</p>
                        <p className="font-semibold">Sign up as a publisher to publish secured encrypted messages to your subscribers.</p>
                    </div>
                    <p className="mb-4 font-medium">By connecting your wallet with Inbox dapp. You allow its to read your address and public key. </p>
                    <button onClick={(e) => { navigate("/register/connected") }} to="/register/connected" className=" mb-2 p-4 bg-black text-white font-semibold">Connect Wallet</button>
                    <p className="text-sm">Powered by WalletConnect</p>
                </div>
            </div>
        </div>
    )
}