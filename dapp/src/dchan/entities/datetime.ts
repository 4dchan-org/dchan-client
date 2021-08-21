import { DateTime } from "luxon";

export function fromBigInt(bigInt: string) {
    return DateTime.fromMillis(parseInt(bigInt) * 1000)
}