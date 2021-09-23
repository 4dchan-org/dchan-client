import { shortenAddress, backgroundColorAddress } from "dchan";
import { trim } from "lodash";
const keccak256 = require('keccak256')

export default function AddressLabel({ address, className = "", etherscannable = true }: { className?: string, address: string, etherscannable?: boolean }) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      // eslint-disable-next-line
      href={etherscannable ? `https://polygonscan.com/address/${address}` : "javascript:void(0)"}
      target={etherscannable ? `_blank` : ""}
    >
      <span
        className={[className, LABEL_CLASSNAME].join(" ")}
        style={{ backgroundColor: backgroundColorAddress(address) }}>
        {trim(btoa(keccak256(address).toString('hex')), "=").substr(-8, 8)}
      </span>
      @<abbr
        className="text-xs font-mono"
        style={{ textDecoration: "none" }} title={address}>
        {shortenAddress(address)}
      </abbr>
    </a>
  );
}

export const LABEL_CLASSNAME = "font-mono font-bold text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs whitespace-nowrap"