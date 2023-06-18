import { isMaticChainId } from "src/services/web3";
import { UserLabel, Faucets } from "src/components";
import polygonLogo from "src/assets/images/polygon.png";
import { useWeb3, useUser } from "src/hooks";
import { User } from "src/subgraph";

export const WalletAccount = () => {
  const { provider, accounts, balance, chainId } = useWeb3();
  const user = useUser().data?.user;
  const account = accounts[0];

  return provider && account && isMaticChainId(chainId) ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<UserLabel user={user ? user : {address: account} as User} />]
        </span>
      </div>
      <div>
        {balance !== undefined ? (
          <span>
            <span className="flex center text-gray-600">
              {balance.toFixed(4)}
              <img
                className="inline h-4 w-4 mx-1"
                alt="MATIC"
                src={polygonLogo}
              />
            </span>
            {balance !== undefined && balance < 0.01 ? (
              <div className="p-4">
                <details>
                  <summary>Need Matic?</summary>
                
                <div className="pt-2">
                  Free faucets:
                  <Faucets />
                </div>
                <div className="pt-2">
                  Or <a className="dchan-link" href="https://wallet.polygon.technology/gas-swap" target="_blank" rel="noreferrer">swap tokens for Matic.</a>
                </div>
                <div className="pt-2">
                  Or <a className="dchan-link" href="https://presearch.com/search?q=buy+matic" target="_blank" rel="noreferrer">buy some.</a>
                </div>
                </details>
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
