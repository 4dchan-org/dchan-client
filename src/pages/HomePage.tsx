import { HeaderNavigation, HeaderLogo } from "src/components";
import { useEffect, useState, useCallback } from "react";
import { useTitle } from "react-use";
import { subscribe, unsubscribe } from "pubsub-js";
import { Board } from "src/subgraph/types";
import {
  Card,
  Footer,
  BoardLink,
  PopularBoardsCard,
  ThreadTabs,
} from "src/components";

export const HomePage = () => {
  useTitle("4dchan.org");

  const [board, setBoard] = useState<Board>();
  const [highlight, setHighlight] = useState<Board>();

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

    return () => {
      unsubscribe(sub);
    };
  }, [setHighlight]);

  return (
    <div className="h-screen bg-primary flex flex-col pb-2">
      <HeaderNavigation />
      <div className="mt-6 relative">
        <div className="top-6 left-0 absolute ">
          <HeaderLogo />
        </div>
        <div className="ml-28 lg:ml-64 h-20 overflow-scroll-disabled text-xs">
          {/* <details>
            <summary>
              <div className="border-tertiary-accent bg-secondary">Stats</div>
            </summary>
            Posts
          </details> */}
        </div>
      </div>
      <hr />
      <div className="mt-2 flex flex-grow flex-col lg:grid-cols-2 lg:grid px-4 text-sm">
        <div>
          <Card
            title="Boards"
            titleRight={
              <>
                {board != null ? (
                  <div className="absolute top-0 right-0">
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
            <PopularBoardsCard highlight={highlight} />
          </Card>
        </div>
        <div>
          <Card
            title={
              <span>
                Threads{" "}
                {board ? (
                  <span>
                    on <BoardLink board={board} />
                  </span>
                ) : (
                  ""
                )}
              </span>
            }
            className="md:px-1 w-full pb-4"
            bodyClassName="p-none b-none"
          >
            <ThreadTabs limit={10} board={board} />
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};
