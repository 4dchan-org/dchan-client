import { useState } from "react";

export default function WalletConnect({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
}: any) {
  const [stillStuck, setStillStuck] = useState<boolean>(false);

  return (
    <div>
      <div>
        [
        <button
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          onClick={async () => {
            const timeout = setTimeout(() => {
              setStillStuck(true);
            }, 2000);
            if (!provider) {
              await loadWeb3Modal();
              clearTimeout(timeout)
              setStillStuck(false);
            } else {
              logoutOfWeb3Modal();
            }
          }}
        >
          {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </button>
        ]
      </div>
      {stillStuck ? (
        <div className="text-xs px-2">
          <div className="p-1 text-center">
            <small>
              You need {" "}
              <a
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                href="//metamask.io"
              >
                Metamask
              </a>{" "}
              (Desktop) or{" "}
              <a
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                href="//trustwallet.com/"
              >
                Trust Wallet
              </a>{" "}
              (Mobile) to interact with dchan
            </small>
          </div>
        </div>
      ) : (
        ""
      )}{" "}
    </div>
  );
}
