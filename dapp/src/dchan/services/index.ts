export function shortenAddress(address: string) {
    let offset = address.indexOf("0x") === 0 ? 2 : 0
    const shortAddress = `${address.substring(offset, offset + 3)}-${address.substring(address.length - 3)}`
    return shortAddress
}

export function backgroundColorAddress(address: string) {
    return `#${shortenAddress(address).replace("-", "")}`
}