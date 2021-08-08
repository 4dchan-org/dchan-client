export type Board = {
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
    body: string,
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