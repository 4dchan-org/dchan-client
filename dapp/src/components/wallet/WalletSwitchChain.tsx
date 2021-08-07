import { switchChain } from "dchan/chain";

export default function WalletConnect({ provider, chainId }: any) {
    return provider && chainId !== "0x89" ? (
        <div className="py-4"><div>You need to be connected to the Polygon chain in order to use dchan</div>[<button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            onClick={() => {
                switchChain()
            }}
        >Switch chain</button>]</div>
    ) : <span></span>
}