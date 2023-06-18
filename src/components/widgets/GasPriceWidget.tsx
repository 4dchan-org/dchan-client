import { useEffect, useState } from "react";
import round from "lodash/round";
import { useWeb3 } from "src/hooks";
import { Emoji } from "src/components";
import { formatUnits } from "ethers";

export const GasPriceWidget = () => {
  const { balance, gasPrice } = useWeb3();
  const [gweiPrice, setGweiPrice] = useState(NaN);
  const [txPrice, setTxPrice] = useState(NaN);

  useEffect(() => {
    if (gasPrice) {
      setTxPrice(
        round(parseFloat(formatUnits(gasPrice, "ether")) * 50000, 5)
      );
      setGweiPrice(
        round(parseFloat(formatUnits(gasPrice, "gwei")))
      );
    }
  }, [gasPrice]);

  const postsLeft =
    txPrice !== 0 && (balance || balance === 0)
      ? Math.floor(balance / txPrice)
      : null;

  return (
    <div className="text-xs pt-1 text-gray-400 hover:text-gray-600">
      {postsLeft !== null ? (
        <>
          <div className="pb-2">~{postsLeft || 0} posts left</div>
        </>
      ) : (
        <></>
      )}
      <small>
        <a href="//polygonscan.com/gastracker" target="_blank" rel="noreferrer">
          <div>Posting costs gas.</div>
          <div>
            <Emoji emoji={"⛽️"} /> Current est. tx price: {txPrice || `?`}{" "}
            MATIC @ {gweiPrice || `?`} gwei.{" "}
            {gweiPrice >= 100 ? (
              <span
                className="px-1"
                title={gweiPrice > 1000 ? "VERY high fees!" : "High fees!"}
              >
                {[...Math.floor(gweiPrice / 100).toString()].map((_, i) => (
                  <Emoji key={"highfees-" + i} emoji="🔥" />
                ))}
              </span>
            ) : (
              <></>
            )}
          </div>
        </a>
      </small>
    </div>
  );
};
