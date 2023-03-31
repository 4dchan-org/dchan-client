import { useThrottleCallback } from "@react-hook/throttle";
import { Board, Thread } from "dchan/subgraph/types";
import { ReactElement } from "react";
import {
  BoardHeader,
  FormPost,
  RefreshWidget,
  BoardViewSettings,
  ContentNavigation,
} from ".";
import useTimeTravel from "dchan/hooks/useTimeTravel";
import { DateTime } from "luxon";

export const ContentHeader = ({
  archive,
  board,
  thread,
  title,
  summary,
  onRefresh,
}: {
  archive?: boolean;
  board?: Board | null;
  thread?: Thread;
  title?: string;
  summary?: ReactElement;
  onRefresh: () => void;
}) => {
  const {
    timeTraveledToBlockNumber: block,
    timeTraveledToDateTime,
    lastBlock,
    isTimeTraveling,
    travelToPresent
  } = useTimeTravel();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

  return (
    <>
      <BoardHeader title={title} board={board} thread={thread} />

      {board === null ? (
        ""
      ) : thread || board ? (
        isTimeTraveling ? (
          <div className="pt-2">
            <span className="opacity-60">Time traveled to {timeTraveledToDateTime?.toLocaleString(DateTime.DATETIME_SHORT)}</span>
            <div className="text-xs text-center">
              [
              <button className="dchan-link" onClick={travelToPresent}>
                Return to present
              </button>
              ]
            </div>
          </div>
        ) : (
          <FormPost thread={thread} board={board} />
        )
      ) : (
        "..."
      )}

      {board !== null ? (
        <div className="p-4 pb-0">
          <hr></hr>
        </div>
      ) : (
        ""
      )}

      <div className="lg:sticky top-0 z-30 pt-6 dchan-navigation-sticky">
        <div className="text-center sm:text-left grid lg:grid-cols-3 text-xs bg-primary pt-2 lg:pt-0">
          <div className="mx-2 flex flex-wrap sm:flex-nowrap justify-center md:justify-start items-center select-none">
            {board ? <ContentNavigation board={board} /> : <span />}

            {!block || (lastBlock && lastBlock.number === block.toString()) ? (
              <RefreshWidget onRefresh={throttledRefresh} />
            ) : (
              ""
            )}
          </div>
          <div className="center grid">
            {summary ? (
              <span className="py-2 text-xs text-gray-600">{summary}</span>
            ) : (
              <span />
            )}
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center pr-2">
            {!archive && !thread && !!board ? <BoardViewSettings /> : ""}
          </div>

          <div className="w-screen">
            <hr></hr>
          </div>
        </div>
      </div>
    </>
  );
};
