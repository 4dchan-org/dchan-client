import { shortenAddress, backgroundColorAddress } from "dchan";
import polygonLogo from "assets/images/polygon.png";

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
        {btoa(address).substr(-6, 6)}
      </span>
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

export const LABEL_CLASSNAME = "font-mono text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs whitespace-nowrap"