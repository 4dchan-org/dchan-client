import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"
import DefaultSettings from "settings/default"

export type Block = {
    id: string,
    timestamp: string,
    number: string
}

export type Board = {
    id: string,
    title: string,
    threadCount: string,
    postCount: string,
    lastBumpedAtBlock: Block,
    createdAtBlock: Block,
    isLocked: boolean,
    isNsfw: boolean,
    name: string
    jannies: BoardJanny[]
}

export type BoardCreationEvent = {
    id: string,
    board: Board
}

export type BoardJanny = {
    id: string
    user: User
    board: Board | undefined // Could have been deleted
}

export type Thread = {
    id: string,
    n: string,
    board: Board | null,
    isPinned: boolean,
    isLocked: boolean,
    op: Post,
    replies: Post[],
    replyCount: string,
    imageCount: string,
    createdAtBlock: Block,
    subject: string,
    score: string
}

export type ThreadCreationEvent = {
    id: string,
    thread: Thread
}

export type Post = {
    id: string,
    board: Board | null,
    thread: Thread | null,
    n: string,
    from: User,
    name: string,
    comment: string,
    image: Image,
    createdAtBlock: Block,
    bans: PostBan[],
    score: string,
}

export type PostCreationEvent = {
    id: string,
    post: Post
}

export type PostBan = {
    post: Post,
    ban: Ban,
}

export type Ban = {
    reason: string,
    expiresAt: string,
}

export type Catalog = {
    threads: Thread[]
}

export type Admin = {
    id: string
}

export type User = {
    id: string,
    address: string,
    name: string,
    jannies: BoardJanny[],
    score: string,
}

export type Image = {
    id: string,
    name: string,
    byteSize: string,
    ipfsHash: string,
    isNsfw: boolean,
    isSpoiler: boolean,
    score: string,
}

export type Client = {
    id: string,
    version: string,
    ipfsHash: string,
    publishedAtBlock: Block
}

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

export async function sendMessage(operation: string, data: object, from: string) {
    const web3 = new Web3(window.web3.currentProvider);

    const relayContract = new web3.eth.Contract(abi as AbiItem[], DefaultSettings.contract.address)
    const msg = await relayContract.methods.message(createJsonMessage(operation, data))

    return msg.send({
        from
    })
}

export async function sendTip(from: string, to: string, amount: number) {
    const web3 = new Web3(window.web3.currentProvider);

    const value = amount * Math.pow(10, 18); // Convert to wei value

    return web3.eth.sendTransaction({ from, to, value })
}

export async function getBalance(account: string) {
    const web3 = new Web3(window.web3.currentProvider);

    return web3.eth.getBalance(account)
}

export function isMaticChainId(chainId: string | number | undefined) {
    return chainId ? chainId === "0x89" || chainId === 137 : false
}