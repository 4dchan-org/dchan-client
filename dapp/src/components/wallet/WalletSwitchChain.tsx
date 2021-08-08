import { switchChain } from "dchan/chain";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function WalletConnect({ provider, chainId }: any) {
    const [stillStuck, setStillStuck] = useState<boolean>()

    return provider && (chainId !== "0x89" && chainId !== 137) ? (
        <div className="p-4">
            <div>
                You need to be connected to the Polygon chain in order to use dchan. {chainId} {!!provider ? "true" : "false"}
            </div>
            <div>
                [<button
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    onClick={async () => {
                        setTimeout(() => {
                            setStillStuck(true)
                        }, 5000)
                        await switchChain()
                    }}
                >Switch chain</button>]
            </div>
            {stillStuck ? <div className="text-xs px-2">In case the above button does not seem to work, refer to <a target="_blank" href="https://www.google.com/search?q=how+to+connect+to+matic" className="text-blue-600 visited:text-purple-600 hover:text-blue-500">this guide</a>.</div> : ""}
        </div>
    ) : <span></span>
}