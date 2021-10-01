import IdLabel from "./IdLabel";
const keccak256 = require('keccak256');

function getCondensedHash(address: string): string {
  let buffer: Buffer = keccak256(address);
  for (let i = 6; i < 32; i++) {
    buffer[i % 6] ^= buffer[i];
  }
  return buffer.slice(0, 6).toString("base64");
}

export default function AddressLabel({ address, className = "", etherscannable = true }: { className?: string, address: string, etherscannable?: boolean }) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      // eslint-disable-next-line
      href={etherscannable ? `https://polygonscan.com/address/${address}` : "javascript:void(0)"}
      target={etherscannable ? `_blank` : ""}
    >
      <IdLabel id={address} className={className}>
        {getCondensedHash(address)}
      </IdLabel>
    </a>
  );
}