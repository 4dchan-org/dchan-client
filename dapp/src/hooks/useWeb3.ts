import { createContext, useCallback, useContext, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { singletonHook } from 'react-singleton-hook';
import Web3Modal from "web3modal";

const NETWORK_NAME = "matic";

type UseWeb3Modal = {
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}
export type UseWeb3 = {
  provider: Web3Provider | undefined;
  chainId: string | number | undefined;
  accounts: string[];
  web3Modal: UseWeb3Modal
}

const Web3Context = createContext(new Web3Modal({
  network: NETWORK_NAME,
  cacheProvider: true
}));

const useWeb3 = singletonHook({
  provider: undefined,
  chainId: undefined, accounts: [],
  web3Modal: {
    loadWeb3Modal: async () => { },
    logoutOfWeb3Modal: async () => { }

  }
}, () => {
  const web3Modal = useContext(Web3Context);
  const [provider, setProvider] = useState<Web3Provider>();
  const [chainId, setChainId] = useState<string | number>();
  const [accounts, setAccounts] = useState<string[]>([]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    console.log({ newProvider })
    setProvider(new Web3Provider(newProvider));
    setChainId(window.ethereum.chainId)

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    })
    console.log({ accounts })
    setAccounts(accounts)

    window.ethereum.on('accountsChanged', (accounts: []) => {
      if (accounts.length === 0) {
        setProvider(undefined)
      }

      console.log({ accounts })

      setAccounts(accounts)
    });
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log({ chainId })

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

  return {
    provider, chainId, accounts, web3Modal: { loadWeb3Modal, logoutOfWeb3Modal }
  }
});

export default useWeb3
