import { getWeb3 } from "dchan";
import { useEffect, useState } from "react";
import { round } from "lodash";
import { useWeb3 } from "hooks";

export default function GasPriceWidget() {
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
    <div className="text-xs pt-1">
      <small>
        <div className="text-gray-400 hover:text-gray-600">Posting costs gas.</div>
        <div className="text-gray-400 hover:text-gray-600">
          <a href="//polygonscan.com/gastracker" target="_blank" rel="noreferrer">
            ⛽️ Current est. tx price: {txPrice} MATIC @ {gweiPrice} gwei.{" "}
            {txPrice !== 0 ? (
              <span>(~{Math.floor(balance / txPrice)} posts left)</span>
            ) : (
              ""
            )}
          </a>
        </div>
      </small>
    </div>
  );
}
