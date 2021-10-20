import { useQuery } from "@apollo/react-hooks";
import BoardLink from "components/BoardLink";
import { Board, Thread, Block } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import { useState, useEffect, useRef } from "react";
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

enum OpenedWidgetEnum {
  TIMETRAVEL = "TIMETRAVEL",
  SEARCH = "SEARCH",
  WATCHEDTHREADS = "WATCHEDTHREADS",
}

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
  const [openedWidget, setOpenedWidget] = useState<OpenedWidgetEnum | null>(null);
  const timeTravelRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLElement>(null);
  const watchedThreadsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setStartBlock(
      thread ? thread.createdAtBlock : board ? board.createdAtBlock : undefined
    );
  }, [thread, board, setStartBlock]);

  useEffect(() => {
    const listener = (event: any) => {
      const refs = [timeTravelRef, searchRef, watchedThreadsRef];
      if (refs.every(r => r.current && !r.current.contains(event.target))) {
        setOpenedWidget(null);
      }
    };

    document.addEventListener("mousedown", listener);
    //document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      //document.removeEventListener("touchstart", listener);
    };
  }, [timeTravelRef, searchRef, watchedThreadsRef])

  const { data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST_MOST_POPULAR,
    { variables: {}, pollInterval: 30_000 }
  );

  const boards = data?.boards;
  return (
    <div className="mb-8">
      <div className="text-sm p-1 border-solid border-bottom-secondary-accent bg-primary border-0 border-b-2 text-left fixed top-0 shadow-md z-50 w-full">
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
        </span>
        <span className="float-right flex flex-row">
          <TimeTravelWidget
            ref={timeTravelRef}
            open={openedWidget === OpenedWidgetEnum.TIMETRAVEL}
            onOpen={() => {
              setOpenedWidget(
                openedWidget === OpenedWidgetEnum.TIMETRAVEL
                  ? null
                  : OpenedWidgetEnum.TIMETRAVEL
              );
            }}
            onClose={() => setOpenedWidget(null)}
            block={block}
            baseUrl={baseUrl || ""}
            startBlock={startBlock}
            dateTime={dateTime}
            startRangeLabel={
              thread ? "Thread creation" : board ? "Board creation" : "?"
            }
          />
          <details className="w-full sm:relative mx-1" open={openedWidget === OpenedWidgetEnum.SEARCH} ref={searchRef}>
            <summary className="list-none cursor-pointer" onClick={(event) => {
              event.preventDefault();
              setOpenedWidget(
                openedWidget === OpenedWidgetEnum.SEARCH
                  ? null
                  : OpenedWidgetEnum.SEARCH
              );
            }}>
              🔍
            </summary>
            <div className="absolute w-screen sm:w-max top-7 sm:top-full sm:mt-1 left-0 right-0 sm:left-auto sm:right-0">
              <SearchWidget baseUrl={Router.posts()} search={search} />
            </div>
          </details>
          <details className="w-full sm:relative mx-1" open={openedWidget === OpenedWidgetEnum.WATCHEDTHREADS} ref={watchedThreadsRef}>
            <summary className="list-none cursor-pointer" onClick={(event) => {
              event.preventDefault();
              setOpenedWidget(
                openedWidget === OpenedWidgetEnum.WATCHEDTHREADS
                  ? null
                  : OpenedWidgetEnum.WATCHEDTHREADS
              );
            }}>
              👁
            </summary>
            <div className="absolute w-screen sm:w-max top-7 sm:top-full sm:mt-1 left-0 right-0 sm:left-auto sm:right-0">
              <WatchedThreadsWidget block={block}/>
            </div>
          </details>
          <span
            className="cursor-pointer mx-1"
            onClick={() => alert("hello world")}
          >
            ⚙️
          </span>
        </span>
      </div>
    </div>
  );
}
