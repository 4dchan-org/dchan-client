import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import { Post } from "../types";

export function sortByCreatedAt(posts: Post[] | undefined) {
    return posts && posts.length > 0
        ? reverse(sortBy(posts, post => parseInt(post.createdAtBlock.timestamp))) : undefined
}

export function isLowScore({
    score
}: Post, threshold: number | string | undefined) {
    return (parseInt(score) / 1_000_000_000) < parseInt(`${threshold || 1}`)
}