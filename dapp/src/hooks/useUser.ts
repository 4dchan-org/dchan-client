import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useQuery } from "@apollo/react-hooks";
import USER_GET from "dchan/graphql/queries/user/get";
import { Admin, User } from "dchan";
import useWeb3 from "./useWeb3";

interface UserData {
  admin?: Admin;
  user?: User;
}
interface UserVars {
  userId: string;
}

function useUser() {
  const { accounts } = useWeb3()

  const query = useQuery<UserData, UserVars>(USER_GET, {
    variables: { userId: accounts.length > 0 ? accounts[0] : "" },
  })

  const { refetch, loading, data } = query

  const isAdmin = () => {
    if(loading) return undefined
    
    const isAdmin = !!(data?.admin?.id)
    console.log({isAdmin})
    return isAdmin
  }

  const isJanny = (boardId: string) => {
    if(loading) return undefined
    
    const isJanny = isAdmin() || !!(data?.user?.jannies?.filter(({id}) => id === boardId).length)
    console.log({isJanny})
    return isJanny
  }

  useEffect(() => {
    refetch()
  }, [accounts])

  return {...query, isJanny, isAdmin }
}

export default useUser;
