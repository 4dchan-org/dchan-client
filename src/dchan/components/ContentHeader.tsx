import { useThrottleCallback } from "@react-hook/throttle";
import { Board, Thread } from "dchan/subgraph/types";
import { useLastBlock } from "dchan/hooks";
import { ReactElement } from "react";
import { BoardHeader, FormPost, RefreshWidget, BoardViewSettings, ContentNavigation } from ".";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const ContentHeader = ({
  board,
  thread,
  title,
  search,
  baseUrl,
  summary,
  onRefresh,
}: {
  board?: Board | null;
  thread?: Thread;
  title?: string;
  search?: string;
  baseUrl?: string;
  summary?: ReactElement;
  onRefresh: () => void;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const { lastBlock } = useLastBlock();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

  return (
    <div>
      <BoardHeader
        title={title}
        board={board}
        thread={thread}
        baseUrl={baseUrl}
        search={search}
      />

      {board === null
       ? ""
       : (thread || board)
       ? <FormPost baseUrl={baseUrl} thread={thread} board={board} />
       : "..."}

      {board !== null ?
        <div className="p-2">
          <hr></hr>
        </div>
      :
        ""
      }

      <div className="text-center sm:text-left grid xl:grid-cols-3 text-xs">
        <div className="mx-2 flex flex-wrap sm:flex-nowrap justify-center md:justify-start items-center">
          {board ? <ContentNavigation board={board} /> : <span />}

          {!block || (lastBlock && lastBlock.number === block.toString()) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="center grid">
          {summary ? <span className="py-2 text-xs text-gray-600">{summary}</span> : <span/>}
        </div>
        <div className="flex flex-wrap justify-center md:justify-end items-center pr-2">{!thread && !!board ? <BoardViewSettings /> : ""}</div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
