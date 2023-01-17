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

export type BoardRef = {
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

export type ThreadRef = {
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
    sage: boolean
}

export type PostRef = {
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
    b58id: string,
    address: string,
    name: string,
    jannies: BoardJanny[],
    score: string,
}

export type Image = {
    id: string,
    name: string,
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