import { TimeTravelContext } from "src/contexts";
import { useContext } from "react";

export const useTimeTravel = () => {
  return useContext(TimeTravelContext)
}