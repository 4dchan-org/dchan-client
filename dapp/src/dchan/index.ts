import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"
import Config from "settings/default"
import { reverse, sortBy } from "lodash"

export const EXTERNAL_LINK_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/igm
export const BACKLINK_REGEX = /&gt;&gt;(\d+)/gm
export const SPOILER_REGEX = /\[spoiler\]((?:.|\s)*?)\[\/spoiler]/gm
export const REF_REGEX = /&gt;&gt;(0[xX][0-9a-fA-F])+/gm
export const TEXT_QUOTES_REGEX = /^&gt;(.*)$/gm
export const NEWLINE_REGEX = /\n/gm

export type Board = {
    id: string,
    title: string,
    threadCount: number,
    postCount: number,
    createdAt: string,
    createdAtBlock: number,
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
    replyCount: number,
    imageCount: number,
    createdAt: string,
    createdAtBlock: string,
    subject: string,
    score: number
}

export type Post = {
    id: string,
    thread: Thread,
    n: number,
    from: User,
    name: string,
    comment: string,
    image: Image,
    createdAt: string,
    createdAtBlock: string,
    bans: PostBan[],
    score: number,
}

export type PostBan = {
    post: Post,
    ban: Ban,
}

export type Ban = {
    reason: string,
    expiresAt: number,
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
    score: number,
}

export type Image = {
    id: string,
    name: string,
    byteSize: number,
    ipfsHash: string,
    isNsfw: boolean,
    isSpoiler: boolean,
    score: number,
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

export function isLowScore({
    score
}: Thread | Post) {
    return (score / 1_000_000_000) < 1
}

export function getLastCreatedAtBlock(threads: Thread[] | undefined) {
    return threads && threads.length > 0
        ? reverse(sortBy(threads, ["createdAtBlock"]))[0].createdAtBlock : undefined
}