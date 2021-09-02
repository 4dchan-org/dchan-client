import { useThrottleCallback } from "@react-hook/throttle";
import { Block, Board, Thread } from "dchan";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Router } from "router";
import BoardHeader from "./board/header";
import FormPost from "./form/FormPost";
import { RefreshWidget } from "./RefreshWidget";
import SearchWidget from "./SearchWidget";
import TimeTravelWidget from "./TimeTravelWidget";

export default function ContentHeader({
  board,
  thread,
  search,
  baseUrl,
  block,
  dateTime,
  onRefresh = () => {},
}: {
  board?: Board;
  thread?: Thread;
  search?: string;
  baseUrl?: string;
  block?: number;
  dateTime?: DateTime;
  onRefresh?: () => void;
}) {
  const lastBlock = useLastBlock();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);
  const [startBlock, setStartBlock] = useState<Block | undefined>();
  useEffect(() => {
    setStartBlock(
      thread ? thread.createdAtBlock : board ? board.createdAtBlock : undefined
    );
  }, [thread, board, setStartBlock]);

  return (
    <div>
      <BoardHeader board={board}></BoardHeader>

      <FormPost thread={thread} board={board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="absolute top-4 sm:top-0 right-4">
        <SearchWidget baseUrl={Router.posts()} search={search} />
      </div>

      <div className="text-center sm:text-left sm:flex">
        <div className="mx-2 flex center">
          <span className="mx-1">
            [
            <HashLink
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              to="#bottom"
            >
              Bottom
            </HashLink>
            ]
          </span>
          {!block || (lastBlock && `${lastBlock.number}` === `${block}`) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="flex-grow"></div>
        <div className="mx-2 sm:text-center sm:text-right sm:flex sm:items-center sm:justify-end">
          <TimeTravelWidget
            baseUrl={baseUrl || ""}
            startBlock={startBlock}
            dateTime={dateTime}
            block={block}
            startRangeLabel={
              thread ? "Thread creation" : board ? "Board creation" : "?"
            }
          />
        </div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
