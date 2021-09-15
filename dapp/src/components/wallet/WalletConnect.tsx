import useWeb3 from "hooks/useWeb3";
import { useCallback, useState } from "react";

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const { provider, loadWeb3Modal, logoutOfWeb3Modal } = useWeb3();

  const onClick = useCallback(async () => {
    if (!provider) {
      setIsConnecting(true)
      await loadWeb3Modal();
      setIsConnecting(false)
    } else {
      logoutOfWeb3Modal();
    }
  }, [provider, loadWeb3Modal, logoutOfWeb3Modal, setIsConnecting])

  return (
    <div>
      <div>
        [
        <button
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          onClick={onClick}
        >
          {isConnecting ? "Connecting wallet..." : !provider ? "Connect Wallet" : "Disconnect Wallet"}
        </button>
        ]
      </div>
      {!provider ? (
        <div className="text-xs px-2">
          <details open={false}>
            <summary> Wallet Details</summary>
            <small className="p-1 text-center">
              <div>You need to connect your wallet to interact with dchan.</div>
              <div>
                Works with{" "}
                <a
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  href="//metamask.io"
                >
                  Metamask
                </a>{" "}
                (for Desktop) or{" "}
                <a
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  href="//trustwallet.com/"
                >
                  Trust Wallet
                </a>{" "}
                (for Mobile).
              </div>
              <div>Other wallets might not be supported.</div>
            </small>
          </details>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
