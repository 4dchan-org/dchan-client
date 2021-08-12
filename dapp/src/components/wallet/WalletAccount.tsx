import AddressLabel from "components/AddressLabel";
import { getBalance, shortenAddress } from "dchan";
import { useEffect, useState } from "react";

export default function WalletAccount({ provider, accounts }: any) {
  const account = accounts[0];
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setBalance(await getBalance(account));
      } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return provider && account ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<AddressLabel address={account}></AddressLabel>]
        </span>
        <span>
          {balance
            ? `(${(parseInt(balance) / Math.pow(10, 18)).toFixed(4)} M)`
            : ""}
        </span>
      </div>
      <div>
        <a href="https://matic.supply/" target="_blank" className="text-blue-600 visited:text-purple-600 hover:text-blue-500">
          Low on Matic?
        </a>
      </div>
    </div>
  ) : (
    <span></span>
  );
}
