import HeaderNavigation from "components/header/HeaderNavigation";
import { WatchedThreadsCard } from "components";
import HeaderLogo from "components/header/logo";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import { useEffect, useState, useCallback } from "react";
import { useTitle } from "react-use";
import { subscribe, unsubscribe } from "pubsub-js";
import { Board } from "dchan";
import {
  Card,
  Footer,
  BoardLink,
  PopularBoardsCard,
  ThreadTabs,
  LatestPostsCard,
} from "components";

export default function HomePage({ location }: any) {
  useTitle("dchan.network");

  const [board, setBoard] = useState<Board>();
  const [highlight, setHighlight] = useState<Board>();
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block}`);
  const queriedBlock = isNaN(block) ? undefined : block;
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const clearBoard = useCallback(
    (e: any) => {
      e.preventDefault();
      setHighlight(undefined);
      setBoard(undefined);
    },
    [setHighlight]
  );

  useEffect(() => {
    const sub = subscribe("BOARD_ITEM_SELECT", (_: any, hoverBoard: Board) => {
      setHighlight(hoverBoard);
      setBoard(hoverBoard);
    });

    return () => unsubscribe(sub);
  }, [setHighlight]);

  return (
    <div className="h-screen bg-primary flex flex-col pb-2">
      <HeaderNavigation
        baseUrl="/"
        block={queriedBlock?.toString()}
        dateTime={dateTime}
      />
      <HeaderLogo block={queriedBlock?.toString()} />
      <div className="flex flex-grow flex-col grid-cols-3 xl:grid px-4 text-sm">
        <div>
          <Card
            title="Boards"
            titleRight={
              <>
                {board != null ? (
                  <div className="absolute top-1/2 bottom-1/2 right-0 mr-4">
                    [
                    <div className="inline dchan-link" onClick={clearBoard}>
                      Clear Board
                    </div>
                    ]
                  </div>
                ) : (
                  ""
                )}
              </>
            }
            className="md:px-1 w-full pb-4"
            bodyClassName="p-none b-none"
          >
            <PopularBoardsCard block={queriedBlock} highlight={highlight} />
          </Card>
          <Card
            title={<span>Watched Threads</span>}
            className="md:px-1 w-full pb-4"
          >
            <WatchedThreadsCard block={queriedBlock} />
          </Card>
        </div>
        <Card
          title={
            <span>
              Threads{" "}
              {board ? (
                <span>
                  on{" "}
                  <BoardLink
                    board={board}
                    block={block == null ? undefined : `${block}`}
                  />
                </span>
              ) : (
                ""
              )}
            </span>
          }
          className="md:px-1 w-full pb-4"
          bodyClassName="p-none b-none"
        >
          <ThreadTabs block={block} limit={10} board={board} />
        </Card>
        <Card
          title={
            <span>
              Latest posts{" "}
              {board ? (
                <span>
                  on{" "}
                  <BoardLink
                    board={board}
                    block={block == null ? undefined : `${block}`}
                  />
                </span>
              ) : (
                ""
              )}
            </span>
          }
          className="md:px-1 w-full pb-4"
        >
          <LatestPostsCard block={block} limit={10} board={board} />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
