import { createContext } from "react";
import { getProvider, requestAccounts } from "src/services/web3";
import { Network, formatUnits, BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";

export type Web3Provider = {
  provider: BrowserProvider | undefined;
  chainId: string | number | undefined;
  accounts: string[];
  balance: number | undefined;
  gasPrice: number | undefined;
  network: Network | undefined;
  connect: () => Promise<{ success?: boolean; error?: any }>;
  disconnect: () => void;
  connected: boolean;
};

export const Web3Context = createContext<Web3Provider>({
  provider: undefined,
  chainId: undefined,
  accounts: [],
  balance: undefined,
  gasPrice: undefined,
  network: undefined,
  connect: async () => ({}),
  disconnect: () => ({}),
  connected: false,
});

export const Web3ContextProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();
  const [network, setNetwork] = useState<Network | undefined>();
  const [chainId, setChainId] = useState<string | number>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>();
  const [gasPrice, setGasPrice] = useState<number>();
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const updateProvider = async () => {
      try {
        const newProvider = getProvider();
        const newNetwork = await newProvider.getNetwork();
        const newAccounts = await newProvider.listAccounts().then(accounts => accounts.map(signer => signer.address.toLowerCase()));

        setProvider(newProvider);
        setChainId(newNetwork.chainId.toString());
        setAccounts(newAccounts);
        setNetwork(newNetwork);
        
        if (newAccounts[0]) {
          const newBalance = await newProvider.getBalance(newAccounts[0]);
          setBalance(Number(formatUnits(newBalance, "ether")));
        }
      } catch (error) {
        console.error({ updateProvider: error });
      }
    };

    let interval: any;
    if (connected) {
      // Update provider and associated data every 10 seconds
      interval = setInterval(updateProvider, 10000);
      updateProvider();
    }
    return () => interval && clearInterval(interval);
  }, [connected]);

  useEffect(() => {
    const updateGasPrice = async () => {
      try {
        const newGasPrice = await provider?.getFeeData();
        setGasPrice(Number(newGasPrice?.gasPrice ?? undefined));
      } catch (error) {
        console.error({ updateGasPrice: error });
      }
    };

    // Update gas price every minute
    let interval: any;
    if (provider) {
      interval = setInterval(updateGasPrice, 60000);
      updateGasPrice();
    }
    return () => interval && clearInterval(interval);
  }, [provider]);

  const connect = useCallback(async () => {
    try {
      const provider = getProvider();
      const accounts = await requestAccounts();
      const network = await provider.getNetwork();
      setProvider(provider);
      setAccounts(accounts);
      setNetwork(network);
      setChainId(network.chainId.toString());
      setConnected(true);

      return { success: accounts.length > 0 };
    } catch (error) {
      return { error };
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(undefined);
    setAccounts([]);
    setNetwork(undefined);
    setChainId(undefined);
    setConnected(false);
  }, []);

  const web3: Web3Provider = {
    provider,
    chainId,
    accounts,
    balance,
    gasPrice,
    connect,
    disconnect,
    network,
    connected,
  };

  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};
