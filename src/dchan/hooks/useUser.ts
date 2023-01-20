import { useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import { USER_GET } from "dchan/subgraph/graphql/queries";
import { Admin, User } from "dchan/subgraph/types";
import useWeb3 from "./useWeb3";

interface UserData {
  admin?: Admin;
  user?: User;
}
interface UserVars {
  address: string;
}

const useUser = (userAddress?: string) => {
  const { accounts } = useWeb3()
  const address = userAddress ?? (accounts.length > 0 ? accounts[0] : "")

  const query = useQuery<UserData, UserVars>(USER_GET, {
    variables: { address },
    skip: !address
  })

  const { loading, data } = query

  const isAdmin = useCallback(() => {
    if (loading) return

    const isAdmin = !!(data?.admin?.id)

    return isAdmin
  }, [loading, data])

  const isJannyOf = useCallback((boardId: string) => {
    if (loading) return

    const isJanny = isAdmin() || !!(data?.user?.jannies?.filter(({ board }) => board?.id === boardId).length)

    return isJanny
  }, [isAdmin, loading, data])

  return { ...query, isJannyOf, isAdmin }
}

export default useUser;
