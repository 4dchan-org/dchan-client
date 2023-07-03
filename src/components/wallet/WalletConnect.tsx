import { useWeb3 } from "src/hooks";
import { WalletConnectButton } from "./WalletConnectButton";

export const WalletConnect = () => {
  const { provider } = useWeb3();

  return (
    <div>
      <WalletConnectButton />

      {!provider ? (
        <div className="text-xs px-2">
          <small className="p-1 text-center">
            <div>
              {"Use "}
              <a className="dchan-link" href="//metamask.io" target="_blank">
                Metamask
              </a>
              {" or "}
              <a className="dchan-link" href="//brave.com/" target="_blank">
                Brave Browser
              </a>
              {" for Desktop"}
            </div>
            <div>
              {"or "}
              <a
                className="dchan-link"
                href="//trustwallet.com/"
                target="_blank"
              >
                Trust Wallet
              </a>
              {" for Mobile"}.
            </div>
            <div>Other wallets might not be supported.</div>
          </small>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
