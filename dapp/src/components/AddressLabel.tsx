import { shortenAddress, backgroundColorAddress } from "dchan";

export default function AddressLabel({ address, className = "", etherscannable = true } : {className?: string, address: string, etherscannable?: boolean}) {
  return (
    <a
      style={{ backgroundColor: backgroundColorAddress(address) }}
      className={[className, LABEL_CLASSNAME].join(" ")}
      // eslint-disable-next-line
      href={etherscannable ? `https://polygonscan.com/address/${address}` : "javascript:void(0)"}
      target={etherscannable ? `_blank` : ""}
    >
      <abbr style={{ textDecoration: "none" }} title={address}>
        {shortenAddress(address)}
      </abbr>
    </a>
  );
}

export const LABEL_CLASSNAME = "font-mono text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs"