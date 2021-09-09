import { Board, Post, Thread } from "dchan";

export abstract class Router {
    public static post({
        n,
        board,
        thread
    }: Post) {
        return board &&
            !!board &&
            !!board.name &&
            !!board.id ? thread ? `/${board.name}/${board.id}/${thread.n}/${n}` : `/${board.name}/${board.id}/${n}` : undefined
    }

    public static thread({
        n,
        board
    }: Thread) {
        return board &&
            !!board.name &&
            !!board.id &&
            !!n ? `/${board.name}/${board.id}/${n}` : undefined
    }

    public static board({
        name,
        id
    }: Board, viewMode?: string) {
        return !!name && !!id ? `/${name}/${id}${viewMode === "catalog" ? "/catalog" : ""}` : undefined
    }

    public static posts() {
        return `/_/posts`
    }

    public static boards() {
        return `/_/boards`
    }
}