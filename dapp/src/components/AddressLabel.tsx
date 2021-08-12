import { shortenAddress, backgroundColorAddress } from "dchan";

export default function AddressLabel({ address, className = "", etherscannable = true } : {className?: string, address: string, etherscannable?: boolean}) {
  return (
    <a
      style={{ backgroundColor: backgroundColorAddress(address) }}
      className={[className, LABEL_CLASSNAME].join(" ")}
      href={etherscannable ? `https://etherscan.io/address/${address}` : "#"}
      target={etherscannable ? `_blank` : ""}
    >
      <abbr style={{ textDecoration: "none" }} title={address}>
        {shortenAddress(address)}
      </abbr>
    </a>
  );
}

// This is the exact moment I stopped giving a fuck
export const LABEL_CLASSNAME = "font-mono text-readable-anywhere px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs"