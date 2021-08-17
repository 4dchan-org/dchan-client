import { useEffect } from "react";
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
    
    return isAdmin
  }

  const isJanny = (boardId: string) => {
    if(loading) return undefined
    
    const isJanny = isAdmin() || !!(data?.user?.jannies?.filter(({id}) => id === boardId).length)
    
    return isJanny
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  return {...query, isJanny, isAdmin }
}

export default useUser;
