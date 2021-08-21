import { Post } from "dchan";

export function isLowScore({
    score
}: Post) {
    return (parseInt(score) / 1_000_000_000) < 1
}