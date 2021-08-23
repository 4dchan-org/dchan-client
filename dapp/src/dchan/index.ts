import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"
import Config from "settings/default"

export const EXTERNAL_LINK_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/igm
export const BACKLINK_REGEX = /&gt;&gt;(\d+)/gm
export const SPOILER_REGEX = /\[spoiler\]((?:.|\s)*?)\[\/spoiler]/gm
export const REF_REGEX = /&gt;&gt;(0[xX][0-9a-fA-F])+/gm
export const TEXT_QUOTES_REGEX = /^&gt;(.*)$/gm
export const NEWLINE_REGEX = /\n/gm

export type Board = {
    id: string,
    title: string,
    threadCount: string,
    postCount: string,
    lastBumpedAt: string,
    createdAt: string,
    createdAtBlock: string,
    isLocked: boolean,
    isNsfw: boolean,
    name: string
    jannies: BoardJanny[]
}

export type BoardJanny = {
    id: string
    user: User
    board: Board | undefined // Could have been deleted
}

export type Thread = {
    id: string,
    board: Board,
    isPinned: boolean,
    isLocked: boolean,
    op: Post,
    replies: Post[],
    replyCount: string,
    imageCount: string,
    createdAt: string,
    createdAtBlock: string,
    subject: string,
    score: string
}

export type Post = {
    id: string,
    thread: Thread,
    n: string,
    from: User,
    name: string,
    comment: string,
    image: Image,
    createdAt: string,
    createdAtBlock: string,
    bans: PostBan[],
    score: string,
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

export type Timestamp = {
    unix: string,
    block: string
}

export function shortenAddress(address: string) {
    return `${address.substring(2, 5)}-${address.substring(address.length - 3)}`
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

    const relayContract = new web3.eth.Contract(abi as AbiItem[], Config.contract.address)
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