import { useQuery } from "@apollo/react-hooks";
import BoardLink from "components/BoardLink";
import { Board, Thread, Block } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Router } from "router";
import TimeTravelWidget from "components/TimeTravelWidget";
import SearchWidget from "components/SearchWidget";
import WatchedThreadsWidget from "components/WatchedThreadsWidget";

interface BoardListData {
  boards: Board[];
}

interface BoardListVars { }

export default function HeaderNavigation({
  block,
  dateTime,
  board,
  thread,
  baseUrl,
  search,
}: {
  block?: string;
  dateTime?: DateTime;
  board?: Board;
  thread?: Thread;
  baseUrl?: string;
  search?: string;
}) {
  const [startBlock, setStartBlock] = useState<Block | undefined>();
  useEffect(() => {
    setStartBlock(
      thread ? thread.createdAtBlock : board ? board.createdAtBlock : undefined
    );
  }, [thread, board, setStartBlock]);
  const { data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST_MOST_POPULAR,
    { variables: {}, pollInterval: 30_000 }
  );

  const boards = data?.boards;
  return (
    <div className="mb-8">
      <div className="text-sm p-1 border-solid border-bottom-secondary-accent bg-primary border-0 border-b-2 text-left fixed top-0 shadow z-50 w-screen">
        [
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          to="/"
        >
          dchan.network
        </Link>
        ]
        <span className="text-black text-opacity-50">
          <span className="hidden sm:inline-block">
            [
            {!!boards &&
              boards.map((board) => (
                <span className="dchan-navigation-board" key={board.id}>
                  <wbr />
                  <BoardLink board={board} block={block} />
                </span>
              ))}
            ]
          </span>
          [
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            to="/_/boards"
          >
            +
          </Link>
          ]
          {/* <span className="px-2"></span> [
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            to="/_/settings"
          >
            ⚙️
          </Link>
          ] */}
          <span className="text-right">
            <TimeTravelWidget
              block={block}
              baseUrl={baseUrl || ""}
              startBlock={startBlock}
              dateTime={dateTime}
              startRangeLabel={
                thread ? "Thread creation" : board ? "Board creation" : "?"
              }
            />
            <SearchWidget baseUrl={Router.posts()} search={search} />
            <WatchedThreadsWidget block={block}/>
          </span>
        </span>
      </div>
    </div>
  );
}
