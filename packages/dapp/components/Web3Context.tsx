import React, { useCallback, useContext, useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";

interface IWeb3Resources {
  web3?: Web3;
  account?: string;
  chainId?: number;
}

interface IWeb3Context extends IWeb3Resources {
  connect: () => Promise<void>;
}

const Web3Context = React.createContext<IWeb3Context>({
  connect: () => Promise.resolve(),
  //disconnect: () => Promise.resolve({}),
});

const useWeb3 = () => useContext(Web3Context);

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [web3Resources, setWeb3Resources] = useState<IWeb3Resources>();

  useEffect(() => {
    const w3m = new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          display: {
            name: "Wallet Connect",
          },
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_KEY, // required
          },
        },
      },
    });
    setWeb3Modal(w3m);
  }, []);

  const disconnect = async () => {
    if (!web3Modal) return;

    //TODO remove/reset context
    await web3Modal.clearCachedProvider();
  };

  const connect = useCallback(async (provider?: string) => {
    if (!web3Modal) return;
    const instance =  provider ? web3Modal.connectTo(provider) : web3Modal.connect();
    const _instance = await instance;

    const web3 = new Web3(_instance);   
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0]

    setWeb3Resources({
      web3: web3,
      account: userAccount,
      chainId: Number(_instance.chainId),
    });
    _instance.on("accountsChanged", (accounts: string[]) => {
      setWeb3Resources((old) => ({
        ...old,
        account: accounts[0],
      }));
    });

    _instance.on("chainChanged", (chainId: number) => {
      setWeb3Resources((old) => ({
        ...old,
        chainId,
      }));
    });
  },[web3Modal]);

  useEffect(() => {
    if (web3Modal) {
      const p = web3Modal.cachedProvider;
      if (p) {
        connect(p);
      }
    }
  },[web3Modal, connect])


  return (
    <Web3Context.Provider value={{ ...web3Resources, connect }}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, useWeb3 };