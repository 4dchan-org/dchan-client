import { IdLabel } from ".";

export const AddressLabel = ({ address, className = "", etherscannable = true }: { className?: string, address: string, etherscannable?: boolean }) => {
  return (
    <a
      className="dchan-link"
      // eslint-disable-next-line
      href={etherscannable ? `https://polygonscan.com/address/${address}` : "javascript:void(0)"}
      target={etherscannable ? `_blank` : ""}
    >
      <IdLabel id={address} className={className}>
        {address}
      </IdLabel>
    </a>
  );
}