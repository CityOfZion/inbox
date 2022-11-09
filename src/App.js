import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import Inbox from "./Inbox";
import { Buffer } from 'buffer';
import { AccountConnectContextProvider } from "./contexts/AccountContext";

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer;
}


function App() {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const wif = searchParams.get("wif") || localStorage.getItem("_inbox_wif")

  return (
    <AccountConnectContextProvider wif={wif}>
      <Inbox />
    </AccountConnectContextProvider>
  );
}

export default App;
