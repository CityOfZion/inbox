import { _request } from '../http'
import { default as Neon } from "@cityofzion/neon-js";


export const MAINNET = "https://n3seed1.ngd.network:10332/"
export const NeoNSMainnetContract = "0x50ac1c37690cc2cfc594472833cf57505d5f46de"


// https://developers.neo.org/docs/n3/neons/api/getRecord
// Available types are:
// 1 - IPV4 address record
// 5 - Canonical name record
// 16 - Text record
// 28 - IPV6 address record

const recordType = {
    "1": "IPV4",
    "5": "CNAME",
    "16": "TEXT",
    "28": "IPV6",
}

export async function ownerOf(nodeUrl, domain) {
    let b = Neon.u.hex2base64(Neon.u.str2hexstring(domain))

    const data = {
        "jsonrpc": "2.0",
        "method": "invokefunction",
        "params": [NeoNSMainnetContract, "ownerOf",
            [
                {
                    "type": "ByteArray", "value": b
                }
            ]
        ],
        "id": 1
    }

    let response = await _request("POST", nodeUrl, data)
    let stack = response.result.stack
    if (stack.length > 0) {
        let ownerAddressByteString = stack[0].value
        let scripthash = Neon.u.base642hex(ownerAddressByteString)
        let reversed = Neon.u.reverseHex(scripthash)
        let a = Neon.create.account(reversed)
        return a.address
    } else {
        return null
    }

}


export async function traverseIterator(nodeUrl, sessionId, iteratorId) {
    const rows = 100
    const data = {
        "id": 5,
        "jsonrpc": "2.0",
        "method": "traverseiterator",
        "params": [sessionId, iteratorId, rows]
    }
    let response = await _request("POST", nodeUrl, data)
    return response
}

//https://developers.neo.org/docs/n3/neons/api/getAllRecords
export async function getAllRecords(nodeUrl, domain) {
    let b = Neon.u.hex2base64(Neon.u.str2hexstring(domain))

    const data = {
        "jsonrpc": "2.0",
        "method": "invokefunction",
        "params": [NeoNSMainnetContract, "getAllRecords",
            [
                {
                    "type": "String", "value": domain
                }
            ],
        ],
        "id": 1
    }

    //TODO: handle error
    let response = await _request("POST", nodeUrl, data)
    let sessionId = response.result.session
    if (sessionId === undefined) {
        return null
    }

    let stack = response.result.stack

    let iterator = stack.find((s) => { return s.interface == "IIterator" })
    if (iterator) {
        let id = iterator.id
        let iteratorResponse = await traverseIterator(nodeUrl, sessionId, id)
        if (iteratorResponse.error != undefined) {
            return null
        }
        const rawRecords = iteratorResponse.result
        var list = []
        rawRecords.map((r) => {
            const values = r.value
            const rawRame = values[0].value // e.g. "ByteString" "aW5ib3gucHVibGlja2V5LmFwaXNpdC5uZW8="
            const rawType = values[1].value // e.g "Integer" "16"
            const rawValue = values[2].value // e.g. "ByteString" "MDM2ZDMwZThmNjIyZWVkMzFmYjUwNjZlYWEyOTE3YzVjN2FkYzIyMGYwZDhhNmU3NGMxZDdlY2MyMjE5ZjQ5Nzhj"

            const name = Neon.u.base642utf8(rawRame)
            const value = Neon.u.base642utf8(rawValue)

            const record = {
                name: name,
                type: recordType[rawType],
                value: value
            }
            list.push(record)
        })

        return list
    }
    return null

}





export async function resolve(nodeUrl, domain, type) {
    const data = {
        "jsonrpc": "2.0",
        "method": "invokefunction",
        "params": [NeoNSMainnetContract, "resolve",
            [
                {
                    "type": "String", "value": domain
                },
                {
                    "type": "Integer", "value": 16
                }
            ]
        ],
        "id": 1
    }

    let response = await _request("POST", nodeUrl, data)
    console.log("resolve", response) //TODO: check with NGD
    return null

}


export async function getRecord(nodeUrl, domain, type) {
    const data = {
        "jsonrpc": "2.0",
        "method": "invokefunction",
        "params": [NeoNSMainnetContract, "getRecord",
            [
                {
                    "type": "String", "value": "apisit.neo"
                },
                {
                    "type": "Integer", "value": "16"
                }
            ]
        ],
        "id": 1
    }

    let response = await _request("POST", nodeUrl, data)
    console.log("getRecord", response) //TODO: check with NGD
    return null

}