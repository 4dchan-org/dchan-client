import { useWeb3 } from "dchan/hooks";
import { WalletConnectButton } from "./WalletConnectButton";

export const WalletConnect = () => {
  const { provider } = useWeb3();

  return (
    <div>
      <WalletConnectButton />
      {!provider ? (
        <div className="text-xs px-2">
          <small className="p-1 text-center">
            <div>You need to connect your wallet to interact with dchan.</div>
            <div>
              Works with{" "}
              <a
                className="dchan-link"
                href="//metamask.io"
              >
                Metamask
              </a>{" "}
              (for Desktop) or{" "}
              <a
                className="dchan-link"
                href="//trustwallet.com/"
              >
                Trust Wallet
              </a>{" "}
              (for Mobile).
            </div>
            <div>Other wallets might not be supported.</div>
          </small>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
