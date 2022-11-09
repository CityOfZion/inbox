import { _get } from '../http'


export async function balance(n3adderss) {
    const url = `https://dora.coz.io/api/v1/neo3/mainnet/balance/${n3adderss}`
    let response = await _get(url)
    return response
}


export async function transactions(n3adderss) {
    const url = `https://dora.coz.io/api/v1/neo3/mainnet/address_txfull/${n3adderss}/1`
    let response = await _get(url)
    return response
}

export async function transactionDetail(hash) {
    const url = `https://dora.coz.io/api/v1/neo3/mainnet/transaction/${hash}`
    let response = await _get(url)
    return response
}