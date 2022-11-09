import { _request } from '../http'
import { default as Neon } from "@cityofzion/neon-js";

const neoNSMainnetContract = "0x50ac1c37690cc2cfc594472833cf57505d5f46de"
const endpoint = "https://neofura.ngd.network/"

export async function getDomainsByAddress(n3address) {
    const a = Neon.create.account(n3address)

    const data = {
        "jsonrpc": "2.0",
        "method": "GetNNSNameByOwner",
        "params": {
            "Asset": neoNSMainnetContract,
            "Owner": "0x" + a.scriptHash,
            "Skip": 0,
            "Limit": 999999
        },
        "id": 1
    }

    let response = await _request("POST", endpoint, data)
    
    if (response.result.length === 0) {
        return []
    }

    var list = response.result.map((d) => {
        return {
            "domain": d.name,
            "expiration": d.expiration
        }
    })
    return list
}

export async function getTransferEventByTransactionHash(hash) {
    
    const data = {
        "jsonrpc": "2.0",
        "method": "GetTransferEventByTransactionHash",
        "params": {
            "TransactionHash": hash
        },
        "id": 1
    }

    let response = await _request("POST", endpoint, data)
   return response
}