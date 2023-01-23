import { useTimeTravel } from "dchan/hooks";
import { Spinner } from ".";

export const Loading = ({
  className = ""
}: {
  className?: string
}) => {
    const { isTimeTraveling } = useTimeTravel()

    return (
      <div className={`${className} dchan-loading flex center p-2`}>
          <div className="opacity-80 pr-1"><Spinner size={8} reverse={isTimeTraveling} speed={"sanic"} /></div>
          <div className="">
            {isTimeTraveling ? "Rewinding" : "Loading..."}
          </div>
      </div>
    )
  }