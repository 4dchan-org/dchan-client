import { Thread } from "dchan";
import { reverse, sortBy } from "lodash";

export function sortByCreatedAt(threads: Thread[] | undefined) {
    return threads && threads.length > 0
        ? reverse(sortBy(threads, ["createdAtBlock"])) : undefined
}

export function isLowScore({
    score
}: Thread, threshold: number | string) {
    return (parseInt(score) / 1_000_000_000) < parseInt(`${threshold}`)
}