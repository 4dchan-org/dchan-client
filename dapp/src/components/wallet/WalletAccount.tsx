import AddressLabel from "components/AddressLabel";
import { getBalance, shortenAddress } from "dchan";
import { useEffect, useState } from "react";
import polygonLogo from "assets/images/polygon.png";

export default function WalletAccount({ provider, accounts }: any) {
  const account = accounts[0];
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    const refreshBalance = async () => {
      try {
        setBalance(parseInt(await getBalance(account)) / Math.pow(10, 18));
      } catch (e) {}
    };

    const interval = setInterval(refreshBalance, 10000);
    refreshBalance();

    return () => clearInterval(interval);
  }, []);

  return provider && account ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<AddressLabel address={account}></AddressLabel>]
        </span>
        {balance ? (
          <span>
            ( {balance.toFixed(4)}
            <img className="inline h-4 w-4 mx-1" title="MATIC" src={polygonLogo}></img>)
          </span>
        ) : (
          ""
        )}
      </div>
      <div>
        {balance && balance < 0.0005 ? (
          <a
            href="https://matic.supply/"
            target="_blank"
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          >
            Low on Matic?
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    <span></span>
  );
}
