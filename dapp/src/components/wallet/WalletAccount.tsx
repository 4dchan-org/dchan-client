import { isMaticChainId } from "dchan";
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
            {balance !== undefined && balance < 0.001 ? (
              <div className="p-4">
                <div>Need Matic?</div>
                <div>
                  Free faucets:
                  <Faucets />
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
