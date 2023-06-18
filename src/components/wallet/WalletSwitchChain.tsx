import { Emoji, StillStuck } from "src/components";
import { isMaticChainId, switchChain } from "src/services/web3";
import { useWeb3 } from "src/hooks";
import { useCallback } from "react";
import { useState } from "react";
import polygonLogo from "src/assets/images/polygon.png";

export const WalletSwitchChain = () => {
  const { provider, chainId, network } = useWeb3();
  const [switchingChain, setSwitchingChain] = useState<boolean>(false);

  const onSwitchChain = useCallback(async () => {
    setSwitchingChain(true);
    await switchChain();
    setSwitchingChain(false);
  }, []);

  return provider && !isMaticChainId(chainId) ? (
    <div className="p-4">
      <div>
        <Emoji emoji={"⚠️"} /> You need to be connected to the{" "}
        <img className="inline h-4 w-4" alt="Polygon" src={polygonLogo} />{" "}
        Polygon chain in order to interact with 4dchan.org.{" "}
        <Emoji emoji={"⚠️"} />
      </div>
      <div className="flex center">
        <div className="m-2 relative">
          <div className="flex center w-16 h-16 rounded-full bg-secondary">
            {network?.name}
          </div>
          <div className="text-xs">ID: {chainId}</div>
          <div
            className="text-xs absolute left-0 right-0 opacity-60"
            style={{ bottom: "-1rem" }}
          >
            (current)
          </div>
        </div>
        <div>
          <button className="dchan-link" onClick={onSwitchChain}>
            <div>
              <Emoji emoji="➡" />
            </div>
            <div>
              <span className="m-2">Switch chain</span>
            </div>
          </button>
        </div>
        <div className="m-2">
          <div className="flex center w-16 h-16 rounded-full bg-secondary">
            <div>
              <img
                className="h-8 w-8"
                alt="Polygon"
                title="Polygon"
                src={polygonLogo}
              />{" "}
            </div>
          </div>
          <div className="text-xs">ID: 137</div>
        </div>
      </div>
      {switchingChain ? (
        <StillStuck ms={3000}>
          <div className="text-xs px-2">
            If the button doesn't work, try switching the network from your
            wallet.
            <StillStuck ms={6000}>
              <div>
                If you can't find the correct chain in your wallet, try manually
                adding it using{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.google.com/search?q=how+to+add+polygon+chain"
                  className="dchan-link"
                >
                  this guide
                </a>
                .
              </div>
            </StillStuck>
          </div>
        </StillStuck>
      ) : (
        ""
      )}
    </div>
  ) : (
    <></>
  );
};
