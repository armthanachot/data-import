import * as cryptoJS from "crypto-js"

const passwordHash = async (password) => {
    const salt = Math.random().toString(36).substring(2)
    const pw = password + salt
    const encrypted = await cryptoJS.SHA256(pw)
    return { salt, encrypted: encrypted.toString() }
}

export {
    passwordHash
}