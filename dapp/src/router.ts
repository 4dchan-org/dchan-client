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
    }: Board) {
        return !!name && !!id ? `/${name}/${id}` : undefined
    }

    public static posts() {
        return `/_/posts`
    }

    public static boards() {
        return `/_/boards`
    }
}