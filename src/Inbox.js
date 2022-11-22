
import React from "react";
import {
    Routes,
    Route,
} from "react-router-dom";
import Account from "./views/Account";
import Compose from "./views/Compose";
import Discovery from "./views/Discovery";
import PublisherDetail from "./views/Discovery/PublisherDetail";
import Home from "./views/Home";
import InboxDetail from "./views/InboxDetail";
import Message from "./views/Message";
import Publisher from "./views/Publisher";
import PublisherConnected from "./views/PublisherConnected";
import PublisherNewMessage from "./views/PublisherNewMessage";
import PublisherRegister from "./views/PublisherRegister";
import Settings from "./views/Settings";
import Welcome from "./views/Welcome/Welcome";

import { useAccountContext } from "./contexts/AccountContext";
import Register from "./views/Register";
import Profile from "./views/Profile";
import Post from "./views/Post/Post";

function Inbox() {

    const accountContext = useAccountContext()
    if (accountContext.account === null) {
        return (
            <Routes>
                <Route path="/" element={<Welcome />}></Route>
                <Route path="/@:domain" element={<Profile />}></Route>
            </Routes>
        )
    }

    return (

        <Routes>
            <Route path="/welcome" element={<Welcome />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route path="/post" element={<Post />}></Route>
            <Route path="/@:domain" element={<Profile />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/inbox/:from" element={<InboxDetail />}></Route>
            <Route path="/inbox/:from/:tx" element={<Message />}></Route>
            {/* <Route path="/inbox/:tx/decrypted/:messageId" element={<DecryptedMessage />}></Route> */}
            <Route path="/publisher" element={<Publisher />}></Route>
            <Route path="/publisher/send" element={<PublisherNewMessage />}></Route>
            <Route path="/register/connected" element={<PublisherConnected />}></Route>
            <Route path="/register" element={<PublisherRegister />}></Route>
            <Route path="/account" element={<Account />}></Route>
            <Route path="/compose" element={<Compose />}></Route>
            <Route path="/discovery/:publisherId" element={<PublisherDetail />}></Route>
            <Route path="/discovery" element={<Discovery />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
        </Routes>

    )
}

export default Inbox;