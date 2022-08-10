import { Post } from "dchan";
import { reverse, sortBy } from "lodash";

export function sortByCreatedAt(posts: Post[] | undefined) {
    return posts && posts.length > 0
        ? reverse(sortBy(posts, post => parseInt(post.createdAtBlock.timestamp))) : undefined
}
export function isLowScore({
    score
}: Post, threshold: number | string | undefined) {
    return (parseInt(score) / 1_000_000_000) < parseInt(`${threshold || 1}`)
}