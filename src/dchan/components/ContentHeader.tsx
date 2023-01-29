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
  board,
  thread,
  title,
  summary,
  onRefresh,
}: {
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
  } = useTimeTravel();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

  return (
    <>
      <BoardHeader title={title} board={board} thread={thread} />

      {board === null ? (
        ""
      ) : thread || board ? (
        isTimeTraveling ? (
          <span className="opacity-60">Time traveled to {timeTraveledToDateTime?.toLocaleString(DateTime.DATETIME_SHORT)}</span>
        ) : (
          <FormPost thread={thread} board={board} />
        )
      ) : (
        "..."
      )}

      {board !== null ? (
        <div className="p-2">
          <hr></hr>
        </div>
      ) : (
        ""
      )}

      <div className="text-center sm:text-left grid xl:grid-cols-3 text-xs xl:sticky top-0 pt-6 z-30 bg-primary">
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
          {!thread && !!board ? <BoardViewSettings /> : ""}
        </div>

        <div className="w-screen">
          <hr></hr>
        </div>
      </div>
    </>
  );
};
