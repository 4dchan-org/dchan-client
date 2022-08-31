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
                  Or buy some from <a className="dchan-link" href="https://changenow.io?link_id=f853ad9ab5b428" target="_blank" rel="noreferrer">changenow.io</a>
                  <div className="grid center" style={{height: "30rem"}}>
                    <iframe title="changenow" id='iframe-widget' src='https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=true&amount=0.01&amountFiat=10&backgroundColor=FFFFFF&darkMode=false&from=usd&horizontal=true&isFiat&lang=en-US&link_id=f853ad9ab5b428&locales=true&logo=true&primaryColor=00C26F&to=matic&toFiat=matic&toTheMoon=true'  style={{height: "25rem"}}></iframe>
                  </div>
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
