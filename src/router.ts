import { Board, Post, Thread } from "src/subgraph/types";

export abstract class Router {
    public static post({
        n,
        board,
        thread,
        from
    }: Post) {
        const fromId = thread?.op?.from?.id

        return board &&
            board &&
            board.name &&
            board.id ? thread && fromId ? `/${board.name}/${board.id}/${fromId}/${thread.n}/${from.id}/${n}` : `/${board.name}/${board.id}/${from.id}/${n}` : undefined
    }

    public static thread({
        n,
        op,
        board
    }: Thread) {
        return board &&
            board.name &&
            board.id &&
            n ? `/${board.name}/${board.id}/${op.from.id}/${n}` : undefined
    }

    public static board({
        name,
        id
    }: Board, viewMode?: string) {
        const urlViewMode = viewMode && ["catalog", "index", "archive"].includes(viewMode) ? `/${viewMode}` : "";
        return name && id ? `/${name}/${id}${urlViewMode}` : undefined
    }

    public static posts({search}: {search?: string} = {}) {
        return `/_/posts${search ? `?search=${search}`: ``}`
    }

    public static boards({search}: {search?: string} | undefined = {}) {
        return `/${search || "_/boards"}`
    }
}