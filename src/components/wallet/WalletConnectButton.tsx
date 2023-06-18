import { useWeb3 } from "src/hooks";
import { useCallback, useState } from "react";
import { StillStuck } from "../StillStuck";
import { Emoji } from "../Emoji";

export const WalletConnectButton = ({
  className = "",
}: {
  className?: string;
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<any | false>(false);
  const [error, setError] = useState<any>();
  const { provider, connect, disconnect } = useWeb3();

  const onClick = useCallback(async () => {
    try {
      if (!provider) {
        setIsConnecting(true);
        const { success, error } = await connect();
        setIsConnecting(false);
        setHasError(!success);
        setError(error);
      } else {
        disconnect()
      }
    } catch (onClickError) {
      console.error({ onClickError });
    }
  }, [connect, disconnect, provider]);

  return (
    <span className={`text-center select-none ${className}`}>
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
            <details>
              <summary>
                <Emoji emoji={"⚠️"} /> Something went wrong. <br />
                Check that your wallet is unlocked and doesn't have any pending
                modals, then try again.
              </summary>
              <div className="bg-red">
              {JSON.stringify(error)}
              </div>
            </details>
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
