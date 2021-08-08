import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"

export type Board = {
    id: string,
    title: string,
    postCount: number,
    name: string
}

export type Thread = {
    id: string,
    board: Board,
    isSticky: boolean,
    isLocked: boolean,
    op: Post,
    replies: Post[],
    replyCount: number,
    imageCount: number
}

export type Post = {
    id: string,
    thread: Thread,
    n: number,
    from: User,
    subject: string,
    comment: string,
    image: Image,
    createdAtUnix: string
}

export type Catalog = {
    threads: Thread[]
}

export type User = {
    id: string,
    name: string,
    score: number,
}

export type Image = {
    id: string,
    name: string,
    byteSize: number,
    ipfsHash: string,
    score: number,
}

export function shortenAddress(address: string) {
    return `${address.substring(2,5)}-${address.substring(address.length-3)}`
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
    const relayContract = new web3.eth.Contract(abi as AbiItem[], "0x5a139ee9f56c4F24240aF366807490C171922b0E");
    const msg = await relayContract.methods.message(createJsonMessage(operation, data))
    return await msg.send({
      from
    })
}