import { shortenAddress } from "dchan";

export default function AddressLabel({ address, etherscannable = true } : {address: string, etherscannable?: boolean}) {
  const addressShort = shortenAddress(address);
  const backgroundColor = `#${addressShort.replace("-", "")}`;

  return (
    <a
      style={{ backgroundColor }}
      className="font-mono text-readable-anywhere px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs"
      href={etherscannable ? `https://etherscan.io/address/${address}` : "#"}
      target={etherscannable ? `_blank` : ""}
    >
      <abbr style={{ textDecoration: "none" }} title={address}>
        {addressShort}
      </abbr>
    </a>
  );
}
