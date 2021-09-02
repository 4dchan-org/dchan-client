import { useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { singletonHook } from 'react-singleton-hook';
import Web3Modal from "web3modal";

const NETWORK_NAME = "matic";

export type UseWeb3 = {
  provider: Web3Provider | undefined;
  chainId: string | number | undefined;
  accounts: string[];
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}

const useWeb3 = singletonHook({
  provider: undefined,
  chainId: undefined, accounts: [],
  loadWeb3Modal: async () => { },
  logoutOfWeb3Modal: async () => { }
}, () => {
  const [web3Modal] = useState<Web3Modal>(new Web3Modal({
    network: NETWORK_NAME,
    cacheProvider: true,
    providerOptions: {
      injected: {
        display: {
          name: "Injected",
          description: "Connect with the provider in your Browser"
        },
        package: null
      }
    }
  }));
  const [provider, setProvider] = useState<Web3Provider>();
  const [chainId, setChainId] = useState<string | number>();
  const [accounts, setAccounts] = useState<string[]>([]);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    try {
      const newProvider = await web3Modal.connect();
      
      setProvider(new Web3Provider(newProvider));
      setChainId(window.ethereum.chainId)

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      setAccounts(accounts)

      window.ethereum.on('accountsChanged', (accounts: []) => {
        if (accounts.length === 0) {
          setProvider(undefined)
        }

        setAccounts(accounts)
      });
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId)
      });
    } catch(error) {
      console.error({error})
    }
  }, [setProvider, setChainId, setAccounts, web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  return {
    provider, chainId, accounts, loadWeb3Modal, logoutOfWeb3Modal
  }
});

export default useWeb3
