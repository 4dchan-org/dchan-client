import { getWeb3 } from "dchan/services/web3";
import { useEffect, useState } from "react";
import { round } from "lodash";
import { useWeb3 } from "dchan/hooks";
import { Twemoji } from "dchan/components";

export const GasPriceWidget = () => {
  const { balance, gasPrice } = useWeb3();
  const [gweiPrice, setGweiPrice] = useState(NaN);
  const [txPrice, setTxPrice] = useState(NaN);

  useEffect(() => {
    if (!!gasPrice) {
      setTxPrice(
        round(parseFloat(getWeb3().utils.fromWei(gasPrice, "ether")) * 50000, 5)
      );
      setGweiPrice(
        round(parseFloat(getWeb3().utils.fromWei(gasPrice, "gwei")))
      );
    }
  }, [gasPrice]);

  return (
    <div className="text-xs pt-1 text-gray-400 hover:text-gray-600">
      <small>
        <a href="//polygonscan.com/gastracker" target="_blank" rel="noreferrer">
          <div>Posting costs gas.</div>
          <div>
            <Twemoji emoji={"⛽️"} /> Current est. tx price: {txPrice || `?`}{" "}
            MATIC @ {gweiPrice || `?`} gwei.{" "}
            {gweiPrice >= 100 ? (
              <span className="px-1" title={gweiPrice > 1000 ? "VERY high fees!" : "High fees!"}>
                {[...Math.floor(gweiPrice / 100).toString()].map((_, i) => (
                  <Twemoji key={"highfees-"+i} emoji="🔥" />
                ))}
              </span>
            ) : (
              <></>
            )}
            {txPrice !== 0 && balance ? (
              <span>(~{Math.floor(balance / txPrice) || `?`} posts left)</span>
            ) : (
              ""
            )}
          </div>
        </a>
      </small>
    </div>
  );
};
