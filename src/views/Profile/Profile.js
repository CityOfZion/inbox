import React from "react"

import { useParams } from "react-router-dom"
import { default as Neon, sc } from "@cityofzion/neon-js";
import * as neons from '../../services/neons'
import { useAccountContext } from "../../contexts/AccountContext";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom"

import * as dora from "../../services/dora"
import PublicMessageTransactionRow from "./PublicMessageTransactionRow";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function Profile(props) {
    const { domain } = useParams()

    const inboxPublicPrefixHex = Neon.u.str2hexstring("inbox.public")

    const [loading, setLoading] = React.useState(true)
    const [domainAccount, setDomainAccount] = React.useState(null)
    const [domainOwnerAddress, setDomainOwnerAddress] = React.useState(null)

    const [isPostDialogPresented, setIsPostDialogPresented] = React.useState(false)

    const accountContext = useAccountContext()
    
    const [inboxTxs, setInboxTxs] = React.useState([])

    const checkInboxPublicKeyOnNeoNS = async (domain) => {
        setLoading(true)
        const node = "https://n3seed1.ngd.network:10332/"

        //0. check if there is an owner of a given domain.
        let ownerAddress = await neons.ownerOf(node, domain)

        if (ownerAddress) {
            setDomainOwnerAddress(ownerAddress)
        } else {
            //if we don't find an owner of this domain then we just stop here.
            setLoading(false)
            setDomainOwnerAddress(null)
            return
        }

        //1. try to get records from NeoNS
        //2. Check if there is "inbox.publickey" in TEXT(16) record
        //3. Convert public key to Neo N3 address by using Neon.create.Account([publicKey])
        //4. show address
        let records = await neons.getAllRecords(node, domain)

        let inboxPublicKeyRecord = records.find((r) => { return r.name.startsWith("inbox.publickey") })

        if (inboxPublicKeyRecord) {
            let a = Neon.create.account(inboxPublicKeyRecord.value)

            if (a) {
                setDomainAccount(a)
            } else {
                setDomainAccount(null)
            }
        } else {
            setDomainAccount(null)
        }
    }

    React.useEffect(() => {
        setLoading(false)
    }, [domainAccount])

    React.useEffect(() => {
        if (domain) {
            checkInboxPublicKeyOnNeoNS(domain)
        }
    }, [domain])

    const truncateMiddle = (string) => {
        return `${string.substring(0, 4)}...${string.substring((string.length - 4))}`
    }

    const loadInboxTransaction = async (address) => {

        //0. get all transactions of this account
        const result = await dora.transactions(address)

        if (result.length === 0) {
            return
        }

        //1. Filter only transactions that are prefixed with definded text(protocol) "inbox.public" 
        const filtered = result.items.filter((t) => {
            const invocation = t.invocations[0]
            return invocation.metadata.data && invocation.metadata.data.startsWith(inboxPublicPrefixHex)
        })


        //2. get from and to address from above transactions
        var addresses = []
        filtered.map((t) => {
            const invocation = t.invocations[0]
            const data = invocation.metadata.data

            const fromAddress = invocation.metadata.from
            const toAddress = invocation.metadata.to


            if (addresses.includes(fromAddress) === false) {
                addresses.push(fromAddress)
            }

            if (addresses.includes(toAddress) === false) {
                addresses.push(toAddress)
            }
        })

        setInboxTxs(filtered)
    }
    React.useEffect(() => {
        if (domainOwnerAddress !== null) {
            loadInboxTransaction(domainOwnerAddress)
        }
    }, [domainOwnerAddress])


    return (
        <div className="flex flex-col absolute inset-0 max-w-lg mx-auto container lg:border-l lg:border-r border-black h-full">

            {
                accountContext.account != null ?


                    <div className="absolute bottom-0 right-0 z-50 p-4">
                        <Link to="/post" className="rounded-full bg-black text-white w-12 h-12 flex items-center justify-center shadow-lg transition ease-in-out delay-150 hover:scale-110">
                            <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                    </div>

                    :
                    null
            }


            <div className=" w-full h-16 z-10 bg-black"></div>


            <div className="-mt-8 z-20 px-4 flex items-end w-full">
                <div className=" flex-none rounded-full bg-black ring-2 ring-white w-16 h-16 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 016.912 4.5H9A.75.75 0 009 3H6.912a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H15a.75.75 0 000 1.5h2.088a1.5 1.5 0 011.434 1.059l2.213 7.191H17.89a3 3 0 00-2.684 1.658l-.256.513a1.5 1.5 0 01-1.342.829h-3.218a1.5 1.5 0 01-1.342-.83l-.256-.512a3 3 0 00-2.684-1.658H3.265l2.213-7.191z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v6.44l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l1.72 1.72V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                </div>

                {
                    domainAccount ?
                        <div className="ml-auto flex items-center text-xs gap-1 pb-1">
                            <GlobeAltIcon className="w-4 h-4"/>
                            <span>Public</span>
                        </div>
                        :
                        <div className="ml-auto">
                        </div>
                }
            </div>

            <div className="px-4 mt-2">
                <div className="flex flex-col">
                    <div className="text-lg font-bold">
                        {domain}
                    </div>
                    <p className="text-xs">{domainAccount && domainAccount.address}</p>
                </div>
            </div>

            {
                domainOwnerAddress == null && loading === false ?
                    <div className="p-4">
                        <p className="text font-bold">This domain doesn’t exist</p>
                        <p>Try searching for another.</p>
                    </div>
                    : null
            }

            <div className="flex-1 flex flex-col overflow-y-auto mt-4 divide-y divide-black border-t border-black">
                {
                    inboxTxs.map((tx) => (
                            <PublicMessageTransactionRow  key={tx.hash} tx={tx}/>
                    ))
                }


            </div>

            {/* {
                    domainAccount ?
                        <div className="p-4">
                            <button className="bg-black text-white font-semibold w-full p-2">Send {domain} an encrypted message</button>
                        </div>
                        : null
                } */}


        </div>
    )
}