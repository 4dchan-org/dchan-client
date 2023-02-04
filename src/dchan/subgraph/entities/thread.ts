import { DateTime } from "luxon";
import { Thread } from "../types";

export function isLowScore({
    score
}: Thread, threshold: number | string | undefined) {
    return (parseInt(score) / 1_000_000_000) < parseInt(`${threshold || 1}`)
}

export function isExpired({
    createdAtBlock
}: Thread, now?: DateTime) {
    return (now || DateTime.now()) > DateTime.fromSeconds(Number(createdAtBlock.timestamp)).plus({seconds: THREAD_EXPIRY_SECONDS})
}

export const THREAD_EXPIRY_SECONDS = 60 * 60 * 24 * 30