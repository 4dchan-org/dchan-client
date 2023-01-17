import { isMaticChainId } from "services";
import { UserLabel, Faucets } from "components";
import polygonLogo from "assets/images/polygon.png";
import { useWeb3, useUser } from "hooks";

export default function WalletAccount() {
  const { provider, accounts, balance, chainId } = useWeb3();
  const user = useUser().data?.user;
  const account = accounts[0];

  return provider && account && user && isMaticChainId(chainId) ? (
    <div className="text-xs center grid">
      <div>
        <span className="px-1">Connected as</span>
        <span key={account}>
          [<UserLabel user={user} />]
        </span>
      </div>
      <div>
        {balance !== undefined ? (
          <span>
            ( {balance.toFixed(4)}
            <img
              className="inline h-4 w-4 mx-1"
              alt="MATIC"
              src={polygonLogo}
            />
            )
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
