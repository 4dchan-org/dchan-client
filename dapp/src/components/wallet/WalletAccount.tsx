import { shortenAddress } from "dchan";

export default function WalletAccount({ provider, accounts }: any) {
  return provider ? (
    <div className="text-xs">
      <span className="px-1">Connected as</span>
      {accounts.map((account: string) => (
        <span key={account}>
          [
          <a
            href={`https://polygonscan.com/address/${account}`}
            target="_blank"
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          >
            {shortenAddress(account)}
          </a>
          ]
        </span>
      ))}
    </div>
  ) : (
    <span></span>
  );
}
