import React from "react";
import PropTypes from 'prop-types';
import { default as Neon } from "@cityofzion/neon-js";
import * as magnet from '../services/magnet'
import * as neons from '../services/neons'

export const AccountContext = React.createContext({});
export const AccountConnectContextProvider = ({ wif, children }) => {

    const [account, setAccount] = React.useState(null);
    const [domains, setDomains] = React.useState([]);

    const getDomains = async (address) => {
        const domainsList = await magnet.getDomainsByAddress(address)

        for (var i = 0; i < domainsList.length; i++) {
            let domain = domainsList[i].domain
            let records = await neons.getAllRecords(neons.MAINNET, domain)
            domainsList[i].records = records
        }

        setDomains(domainsList)
    }

    const init = React.useCallback(async () => {

        if (wif === undefined || wif === null) {
            setAccount(null)
            return
        }

        const isWif = Neon.is.wif(wif);
        if (isWif) {
            const neoAccount = Neon.create.account(wif)
            setAccount(neoAccount)
            getDomains(neoAccount.address) // 0. try to get a list domains
            localStorage.setItem("_inbox_wif", wif)
        }
    }, []);

    React.useEffect(() => {
        init()
    }, [])

    const contextValue = {
        account,
        domains,
    };

    return (React.createElement(AccountContext.Provider, { value: contextValue }, children));
};

export const useAccountContext = () => React.useContext(AccountContext);
AccountConnectContextProvider.propTypes = {
    children: PropTypes.any.isRequired,
};