import { useWeb3 } from "dchan/hooks";
import { useCallback, useState } from "react";
import { StillStuck } from "../StillStuck";
import { Twemoji } from "../Twemoji";

export const WalletConnectButton = ({
  className = ""
}: {
  className?: string
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<any | false>(false);
  const { provider, loadWeb3Modal, logoutOfWeb3Modal } = useWeb3();

  const onClick = useCallback(async () => {
    try {
      if (!provider) {
        setIsConnecting(true);
        const { success } = await loadWeb3Modal();
        setIsConnecting(false);
        setHasError(!success);
      } else {
        logoutOfWeb3Modal();
      }
    } catch (onClickError) {
      console.error({ onClickError });
    }
  }, [provider, loadWeb3Modal, logoutOfWeb3Modal, setIsConnecting, setHasError]);

  return (
    <span className={`text-center ${className}`}>
      <div>
        [
        <button className="dchan-link" onClick={onClick}>
          {isConnecting
            ? "Connecting wallet..."
            : !provider
            ? "Connect Wallet"
            : "Disconnect Wallet"}
        </button>
        ]
      </div>
      <span className="text-sm">
        {hasError ? (
          <span>
            <Twemoji emoji={"⚠️"} /> Something went wrong. <br />
            Check that your wallet is unlocked and doesn't have any pending
            modals, then try again.
          </span>
        ) : (
          ""
        )}
        {!hasError && isConnecting ? (
          <StillStuck ms={2000}>
            <span>
              If the above button does not work, try unlocking your wallet
              first, then retry.
            </span>
          </StillStuck>
        ) : (
          ""
        )}
      </span>
    </span>
  );
};
