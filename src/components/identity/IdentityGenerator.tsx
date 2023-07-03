import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { HDNodeWallet } from "ethers";
import ClickNotice from "../utils/ClickNotice";
import { Emoji, UserLabel } from "..";
import { User } from "src/subgraph/types";

function IdentityGenerator() {
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);

  function generateWallet() {
    const randomWallet = ethers.Wallet.createRandom();
    setWallet(randomWallet);
  }

  // async function signMessage(message: string) {
  //   if (wallet && message) {
  //     return wallet.signMessage(message);
  //   }
  // }

  useEffect(generateWallet, []);

  return (
    <div className="flex items-center flex-wrap">
      {wallet && <UserLabel user={wallet as unknown as User} />}
      <button className="mx-2" onClick={generateWallet} type="button">
        <Emoji emoji="🔄" />
      </button>
      <details>
        <summary></summary>
        {wallet?.mnemonic ? (
          <div className="items-center">
            <details>
              <summary>Seed phrase</summary>
              <div className="bg-secondary p-2">
                <small className="text-xs text-center">
                  <div>
                    <Emoji emoji={"⚠️"} />
                    Be careful!
                    <Emoji emoji={"⚠️"} />
                  </div>
                  <div>This is a randomly generated anonymous seed phrase.</div>
                  <div>
                    It is one time use and should ONLY be used to anonymously sign 4dchan.org messages.
                  </div>
                  <div>
                    CONSIDER IT ALREADY COMPROMISED.
                  </div>
                  <div>
                    Do NOT send funds to it. Do NOT restore it on any device.
                  </div>
                  <div>
                    <Emoji emoji={"⚠️"} />
                    Be careful!
                    <Emoji emoji={"⚠️"} />
                  </div>
                </small>
              </div>
              <div className="flex">
                <textarea key={wallet?.address} className="w-full" readOnly>
                  {wallet.mnemonic.phrase}
                </textarea>
                <ClickNotice
                  notice={
                    <div className="bg-primary p-2 text-xs">
                      <div>Seed phrase</div>
                      <div>copied to clipboard</div>
                    </div>
                  }
                >
                  <CopyToClipboard text={wallet.mnemonic.phrase}>
                    <button
                      className="p-2"
                      title="Copy to clipboard"
                      type="button"
                    >
                      📋
                    </button>
                  </CopyToClipboard>
                </ClickNotice>
              </div>
            </details>
          </div>
        ) : (
          ""
        )}
      </details>
    </div>
  );
}

export default IdentityGenerator;
