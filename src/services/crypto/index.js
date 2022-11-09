import * as crypto from 'crypto-browserify'
import CryptoJS from 'crypto-js'

export function CreateSharedSecret(privateKeyHex, publicKeyHex) {
    const a = crypto.createECDH('secp256r1');
    a.setPrivateKey(privateKeyHex, "hex")
    let alicePrivateKeyHex = a.getPrivateKey().toString('hex')
    const secret = a.computeSecret(publicKeyHex, "hex")
    return secret.toString('hex')
}

//returns encrypted text in OpenSSL-compatible format.
export function Encrypt(text, key) {
    var encrypted = CryptoJS.AES.encrypt(text, key);
    return  encrypted.toString() //openSSL format. Salt, ciphertext (OpenSSL format, Base64)
    return { ciphertext: encrypted.ciphertext.toString(), salt: encrypted.salt.toString() }
}

export function Decrypt(ciphertext, key) {
    var decrypted = CryptoJS.AES.decrypt(ciphertext, key);
    return decrypted.toString(CryptoJS.enc.Utf8)
}
