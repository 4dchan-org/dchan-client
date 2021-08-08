import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "INVALID_INFURA_KEY";

const NETWORK_NAME = "matic";

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState<Web3Provider>();
  const [chainId, setChainId] = useState<string>();
  const [autoLoaded, setAutoLoaded] = useState<boolean>(false);
  const { autoLoad = false, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config as any;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    },
  });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
    setChainId(window.ethereum.chainId)
    window.ethereum.on('accountsChanged', (accounts: []) => {
      console.log({accounts})
      if(accounts.length == 0) {
        setProvider(undefined)
      }
    });
    window.ethereum.on('chainChanged', (chainId: string) => {
      setChainId(chainId)
    });
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, chainId, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
