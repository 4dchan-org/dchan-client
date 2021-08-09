import { shortenAddress } from "dchan";

export default function AddressLabel({ address }: { address: string }) {
  const addressShort = shortenAddress(address);
  const backgroundColor = `#${addressShort.replace("-", "")}`;

  return (
    <a
      style={{ backgroundColor }}
      className="font-mono text-readable-anywhere px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs"
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
    >
      <abbr style={{ textDecoration: "none" }} title={address}>
        {addressShort}
      </abbr>
    </a>
  );
}
