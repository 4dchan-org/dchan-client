import { DateTime } from "luxon";
import { Spinner } from ".";
import { useTimeTravel } from "src/hooks";

export const Loading = ({ className = "" }: { className?: string }) => {
  const { isTimeTraveling, timeTraveledToDateTime } = useTimeTravel();

  return (
    <div className={`${className} dchan-loading flex center p-2`}>
      <div className="opacity-80 pr-1">
        <Spinner size={8} reverse={isTimeTraveling} speed={"sanic"} />
      </div>
      <div className="">
        {isTimeTraveling ? (
          <>
            <div>Time traveling to...</div>
            <div className="text-xs opacity-70">
              {timeTraveledToDateTime?.toLocaleString(DateTime.DATETIME_SHORT)}
            </div>
            <div className="text-xs opacity-50">
              {timeTraveledToDateTime?.toRelative()}
            </div>
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </div>
  );
};
