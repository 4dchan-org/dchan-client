import { Web3Context } from "src/contexts";
import { useContext } from "react";

export const useWeb3 = () => {
  return useContext(Web3Context)
}