import { shortenAddress } from "dchan";
import polygonLogo from "assets/images/polygon.png";
import { trim } from "lodash";
import IdLabel from "./IdLabel";
const keccak256 = require('keccak256')

export default function AddressLabel({ address, className = "", etherscannable = true }: { className?: string, address: string, etherscannable?: boolean }) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      // eslint-disable-next-line
      href={etherscannable ? `https://polygonscan.com/address/${address}` : "javascript:void(0)"}
      target={etherscannable ? `_blank` : ""}
    >
      <IdLabel id={address} className={className}>
        {trim(btoa(keccak256(address).toString('hex')), "=").substr(-8, 8)}
      </IdLabel>
      <abbr
        style={{ textDecoration: "none" }} title={address}>
        <img
          className="inline h-4 w-4 mx-1"
          alt="MATIC"
          src={polygonLogo}
        ></img>{shortenAddress(address)}
      </abbr>
    </a>
  );
}
