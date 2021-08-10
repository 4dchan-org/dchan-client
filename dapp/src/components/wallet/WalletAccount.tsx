import AddressLabel from "components/AddressLabel";
import { shortenAddress } from "dchan";

export default function WalletAccount({ provider, accounts }: any) {
  return provider ? (
    <div className="text-xs">
      <span className="px-1">Connected as</span>
      {accounts.map((account: string) => (
        <span key={account}>
          [
            <AddressLabel address={account}></AddressLabel>
          ]
        </span>
      ))}
    </div>
  ) : (
    <span></span>
  );
}
