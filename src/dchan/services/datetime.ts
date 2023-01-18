import { DateTime } from "luxon";

export function fromBigInt(bigInt: string) {
    return DateTime.fromSeconds(parseInt(bigInt))
}