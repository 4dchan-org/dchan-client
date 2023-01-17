import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"
import DefaultSettings from "settings/default"

export * from "./dchan/types"

export function shortenAddress(address: string) {
    let offset = address.indexOf("0x") === 0 ? 2 : 0
    const shortAddress = `${address.substring(offset, offset + 3)}-${address.substring(address.length - 3)}`
    return shortAddress
}

export function backgroundColorAddress(address: string) {
    return `#${shortenAddress(address).replace("-", "")}`
}

export function createJsonMessage(op: string, data: object) {
    return JSON.stringify({
        ns: "dchan",
        v: 0,
        op,
        data
    })
}

export function getCurrentProvider() {
    return window.ethereum || window.web3.currentProvider;
} 

export async function sendMessage(operation: string, data: object, from: string) {
    const web3 = getWeb3()

    const relayContract = new web3.eth.Contract(abi as AbiItem[], DefaultSettings.contract.address)
    const [msg, nonce] = await Promise.all([
        relayContract.methods.message(createJsonMessage(operation, data)),
        getNextNonce(from)
    ])

    return msg.send({
        from,
        nonce
    })
}

export async function sendTip(from: string, to: string, amount: number) {
    const web3 = getWeb3()

    const value = amount * Math.pow(10, 18); // Convert to wei value

    return web3.eth.sendTransaction({ from, to, value })
}

export function getWeb3() {
    return new Web3(getCurrentProvider());
}

export async function getBalance(account: string) {
    return getWeb3().eth.getBalance(account)
}

export async function getGasPrice() {
    return getWeb3().eth.getGasPrice()
}

export async function getNextNonce(account: string) {
    return getWeb3().eth.getTransactionCount(account).then(txCount => txCount + 1)
}

export function isMaticChainId(chainId: string | number | undefined) {
    return chainId ? chainId === "0x89" || chainId === 137 : false
}