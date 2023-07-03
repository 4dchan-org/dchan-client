import { useThrottleCallback } from "@react-hook/throttle";
import { Board, Thread } from "src/subgraph/types";
import { ReactElement, useContext } from "react";
import {
  BoardHeader,
  FormPost,
  RefreshWidget,
  BoardViewSettings,
  ContentNavigation,
  OpenedWidgetEnum,
} from ".";
import { DateTime } from "luxon";
import { WidgetContext } from "src/contexts/WidgetContext";
import { useTimeTravel } from "src/hooks";

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
  } = useTimeTravel();
  const [,openWidget] = useContext(WidgetContext);
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

  return (
    <>
      <BoardHeader title={title} board={board} thread={thread} />

      {board === null ? (
        ""
      ) : thread || board ? (
        isTimeTraveling && timeTraveledToDateTime ? (
          <div className="pt-2">
            <span className="opacity-80 p-2">
              <div>Time traveled to</div>
              <div>
                {timeTraveledToDateTime?.toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
              </div>
              <div>{timeTraveledToDateTime?.toRelative()}</div>
            </span>
            <div className="text-xs text-center p-2 select-none">
              <button className="dchan-brackets" onClick={() => openWidget(OpenedWidgetEnum.TIMETRAVEL)}>
                Time Travel
              </button>
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

      <div className="sticky top-0 z-30 pt-6 dchan-navigation-sticky">
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
            {!archive && !thread && board ? <BoardViewSettings /> : ""}
          </div>

          <div className="w-screen">
            <hr></hr>
          </div>
        </div>
      </div>
    </>
  );
};
