import { Thread } from "dchan";

export function isLowScore({
    score
}: Thread, threshold: number | string | undefined) {
    return (parseInt(score) / 1_000_000_000) < parseInt(`${threshold || 1}`)
}