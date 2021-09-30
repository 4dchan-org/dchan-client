import AddressLabel from "components/AddressLabel";
import { getBalance, isMaticChainId } from "dchan";
import { useEffect, useState } from "react";
import polygonLogo from "assets/images/polygon.png";
import useWeb3 from "hooks/useWeb3";

export default function WalletAccount() {
  const { provider, accounts, chainId } = useWeb3();
  const account = accounts[0];
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    const refreshBalance = async () => {
      try {
        if (account) {
          setBalance(parseInt(await getBalance(account)) / Math.pow(10, 18));
        } else {
          setBalance(undefined);
        }
      } catch (e) {
        console.error({ refreshBalance: e });
      }
    };

    const interval = setInterval(refreshBalance, 10000);
    refreshBalance();

    return () => clearInterval(interval);
  }, [account]);

  return provider && account && isMaticChainId(chainId) ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<AddressLabel address={account}></AddressLabel>]
        </span>
      </div>
      <div>
        {balance !== undefined ? (
          <span>
            ( {balance.toFixed(4)}
            <img
              className="inline h-4 w-4 mx-1"
              alt="MATIC"
              src={polygonLogo} />
            )
            {balance !== undefined && balance < 0.0005 ? (
              <div className="p-4">
                <div>Need Matic?</div>
                <div>
                  Free faucets:
                  <ul>
                    <li>
                      <a
                        href="https://faucet.dchan.network/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      >
                        https://faucet.dchan.network
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://matic.supply/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      >
                        https://matic.supply
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://macncheese.finance/matic-polygon-mainnet-faucet.php"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      >
                        https://macncheese.finance
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
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
