import { User } from "dchan";
import { useQuery } from "@apollo/react-hooks";
import USER_GET from "dchan/graphql/queries/user/get";

interface UserData {
  user?: User;
}
interface UserVars {
  userId: string;
}
export default function UserData(accounts: string[]) {
  const userId = accounts.length > 0 ? accounts[0] : "";
  const { data } = useQuery<UserData, UserVars>(USER_GET, {
    variables: { userId: userId },
  });
  return data;
}
