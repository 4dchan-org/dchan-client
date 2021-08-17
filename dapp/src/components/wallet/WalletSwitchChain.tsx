import { switchChain } from "dchan/chain";
import { useState } from "react";

export default function WalletConnect({ provider, chainId }: any) {
  const [stillStuck, setStillStuck] = useState<boolean>(false);

  return provider && chainId !== "0x89" && chainId !== 137 ? (
    <div className="p-4">
      <div>
        You need to be connected to the Polygon chain in order to interact with
        dchan.
      </div>
      <div className="text-xs">Current chain ID: {chainId}</div>
      <div>
        [
        <button
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          onClick={async () => {
            setTimeout(() => {
              setStillStuck(true);
            }, 2000);
            await switchChain();
          }}
        >
          Switch chain
        </button>
        ]
      </div>
      {stillStuck ? (
        <div className="text-xs px-2">
          In case the above button does not seem to work, refer to{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.google.com/search?q=how+to+connect+to+polygon+chain"
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          >
            this guide
          </a>
          .
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <span></span>
  );
}
