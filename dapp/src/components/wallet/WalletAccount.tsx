import AddressLabel from "components/AddressLabel";
import { getBalance } from "dchan";
import { useEffect, useState } from "react";
import polygonLogo from "assets/images/polygon.png";
import useWeb3 from "hooks/useWeb3";

export default function WalletAccount() {
  const { provider, accounts } = useWeb3()
  const account = accounts[0];
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    const refreshBalance = async () => {
      try {
        if(account) {
          setBalance(parseInt(await getBalance(account)) / Math.pow(10, 18));
        } else {
          setBalance(undefined)
        }
      } catch (e) {
        console.error({ refreshBalance: e });
      }
    };

    const interval = setInterval(refreshBalance, 10000);
    refreshBalance();

    return () => clearInterval(interval);
  }, [account]);

  return provider && account ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<AddressLabel address={account}></AddressLabel>]
        </span>
      </div>
      <div>
        {balance ? (
          <span>
            ( {balance.toFixed(4)}
            <img
              className="inline h-4 w-4 mx-1"
              alt="MATIC"
              src={polygonLogo}
            ></img>
            )
            {balance < 0.0005 ? (
              <a
                href="https://matic.supply/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
              >
                Low on Matic?
              </a>
            ) : (
              ""
            )}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    <span></span>
  );
}
