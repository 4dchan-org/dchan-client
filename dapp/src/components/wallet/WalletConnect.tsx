export default function WalletConnect({ provider, loadWeb3Modal, logoutOfWeb3Modal }: any) {
    return (
        <div>[<button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            onClick={() => {
                if (!provider) {
                    loadWeb3Modal();
                } else {
                    logoutOfWeb3Modal();
                }
            }}
        >
            {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </button>]</div>
    );
}