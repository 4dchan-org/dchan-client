import { useQuery } from "@apollo/react-hooks";
import { Board, Thread, Block, User } from "src/subgraph/types";
import { BOARDS_LIST_MOST_POPULAR } from "src/subgraph/graphql/queries";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Router } from "src/router";
import {
  BoardLink,
  TimeTravelWidget,
  WatchedThreadsWidget,
  Emoji,
  SettingsWidget,
  Overlay,
  UserLabel,
  Wallet,
} from "src/components";
import { useTimeTravel, useUser, useWeb3 } from "src/hooks";
import { subscribe, unsubscribe } from "pubsub-js";
import { WidgetContext } from "src/contexts/WidgetContext";

interface BoardListData {
  boards: Board[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BoardListVars {}

export enum OpenedWidgetEnum {
  BOARDS = "BOARDS",
  TIMETRAVEL = "TIMETRAVEL",
  SEARCH = "SEARCH",
  WATCHEDTHREADS = "WATCHEDTHREADS",
  SETTINGS = "SETTINGS",
  WALLET = "WALLET",
}

const siteCreatedAtBlock: Block = {
  id: "0x04eeaa77c96947c5efca4abd8e3f8de005369390409d79dfef81aa983eb69e89",
  number: "17766365",
  timestamp: "1628450632",
};

type StartBlock = {
  label: string;
  block: Block;
};

export const HeaderNavigation = ({
  board,
  thread,
}: {
  board?: Board;
  thread?: Thread;
}) => {
  const { provider, accounts } = useWeb3();
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const [startBlock, setStartBlock] = useState<StartBlock>({
    label: "Site creation",
    block: siteCreatedAtBlock,
  });
  const [openedWidget, setOpenedWidget] = useContext(WidgetContext);
  const showBoards = openedWidget === OpenedWidgetEnum.BOARDS;
  const timeTravelRef = useRef<HTMLDetailsElement>(null);
  const boardsRef = useRef<HTMLDetailsElement>(null);
  const watchedThreadsRef = useRef<HTMLDetailsElement>(null);
  const settingsRef = useRef<HTMLDetailsElement>(null);
  const walletRef = useRef<HTMLDetailsElement>(null);

  const user = useUser().data?.user;

  const onWidgetOpen = useCallback(
    (_a: string, widget: string) => {
      widget in OpenedWidgetEnum && setOpenedWidget(widget as OpenedWidgetEnum);
    },
    [setOpenedWidget]
  );

  useEffect(() => {
    const sub = subscribe("WIDGET_OPEN", onWidgetOpen);

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    if (!thread && !board) {
      // persist the current start block until we know it's actually changed
      // this is to prevent the time travel range jumping around every time
      // the user time travels
      return;
    }
    setStartBlock(
      thread
        ? { label: "Thread creation", block: thread.createdAtBlock }
        : board
        ? { label: "Board creation", block: board.createdAtBlock }
        : { label: "Site creation", block: siteCreatedAtBlock }
    );
  }, [thread, board, setStartBlock]);

  const { data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST_MOST_POPULAR
    // { variables: {}, pollInterval: 30_000 }
  );

  const widgetClass = ["fixed top-6"].join(" ");

  const boards = data?.boards;
  return (
    <div className="dchan-header-navigation">
      {openedWidget !== null ? (
        <div
          className="w-100vw h-100vh z-50 fixed top-0 left-0"
          onClick={() => setOpenedWidget(null)}
        />
      ) : (
        <></>
      )}
      <div className="text-sm p-01 border-solid border-bottom-tertiary-accent bg-secondary border-0 border-b-2 text-left fixed top-0 left-0 right-0 shadow-md z-50 flex flex-wrap justify-between items-center">
        <div className="header-section flex-1">
          <span className="text-black text-opacity-50 hover:text-opacity-100 dchan-brackets">
            <Link
              className="dchan-link font-bold"
              to={`/${block ? `?block=${block}` : ""}`}
            >
              4dchan.org
            </Link>
          </span>
          {board ? <BoardLink board={board} /> : <></>}
          <span className="text-black text-opacity-50 hover:text-opacity-100 select-none px-1">
            <details
              className="mx-1 inline"
              title="Boards"
              open={openedWidget === OpenedWidgetEnum.BOARDS}
              ref={boardsRef}
            >
              <summary
                className="list-none cursor-pointer opacity-60 hover:opacity-100 select-none"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenedWidget(
                    openedWidget === OpenedWidgetEnum.BOARDS
                      ? null
                      : OpenedWidgetEnum.BOARDS
                  );
                }}
              >
                <span className="inline dchan-brackets">
                  <span className="dchan-link w-2 inline-block text-center">
                    {showBoards ? "-" : "+"}
                  </span>
                </span>
              </summary>
              <div className={widgetClass + " left-0"}>
                <div className="bg-secondary border border-tertiary-accent border-solid p-1">
                  <span className="hidden sm:inline-block dchan-brackets">
                    {boards &&
                      boards.map((board) => (
                        <span
                          className="dchan-navigation-board"
                          key={board.id}
                        >
                          <wbr />
                          <BoardLink board={board} />
                        </span>
                      ))}
                  </span>
                  <Link
                    className={"dchan-brackets " + (showBoards ? "" : "hidden")}
                    to={`${Router.boards()}${block ? `?block=${block}` : ""}`}
                  >
                    <span className="dchan-link">...</span>
                  </Link>
                </div>
              </div>
            </details>
          </span>
          <span className="text-black text-opacity-50 hover:text-opacity-100 select-none pr-1">
            [
            <Link
              className="dchan-link"
              to={`${Router.posts()}${block ? `?block=${block}` : ""}`}
            >
              <Emoji emoji={"🔍"} />
            </Link>
            ]
          </span>
        </div>
        <div className="header-section flex-1 flex justify-center">
          <TimeTravelWidget
            ref={timeTravelRef}
            open={openedWidget === OpenedWidgetEnum.TIMETRAVEL}
            widgetClassName={widgetClass + " w-screen left-0"}
            onOpen={() => {
              setOpenedWidget(
                openedWidget === OpenedWidgetEnum.TIMETRAVEL
                  ? null
                  : OpenedWidgetEnum.TIMETRAVEL
              );
            }}
            onClose={() => setOpenedWidget(null)}
            startBlock={startBlock.block}
            startRangeLabel={startBlock.label}
          />
        </div>
        <div className="header-section flex-1 flex justify-end">
          <span className="flex flex-row mr-1 select-none">
            <details
              className="mx-1"
              title="Watched Threads"
              open={openedWidget === OpenedWidgetEnum.WATCHEDTHREADS}
              ref={watchedThreadsRef}
            >
              <summary
                className="list-none cursor-pointer opacity-60 hover:opacity-100 select-none"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenedWidget(
                    openedWidget === OpenedWidgetEnum.WATCHEDTHREADS
                      ? null
                      : OpenedWidgetEnum.WATCHEDTHREADS
                  );
                }}
              >
                <Emoji emoji={"⭐️"} />
              </summary>
              <div className={widgetClass + " right-0"}>
                <WatchedThreadsWidget />
              </div>
            </details>
            <span
              ref={settingsRef}
              title={"Settings"}
              className="cursor-pointer opacity-60 hover:opacity-100 mx-1 select-none"
              onClick={() => {
                setOpenedWidget(
                  openedWidget === OpenedWidgetEnum.SETTINGS
                    ? null
                    : OpenedWidgetEnum.SETTINGS
                );
              }}
            >
              <Emoji emoji={"⚙️"} />
              {openedWidget === OpenedWidgetEnum.SETTINGS ? (
                <Overlay
                  onExit={() => setOpenedWidget(null)}
                  overlayClassName="w-full sm:w-4/6 h-5/6"
                >
                  <SettingsWidget onExit={() => setOpenedWidget(null)} />
                </Overlay>
              ) : (
                ""
              )}
            </span>
            <details
              className="mx-1 select-none"
              open={openedWidget === OpenedWidgetEnum.WALLET}
              ref={walletRef}
            >
              <summary
                title="Wallet"
                className="list-none cursor-pointer opacity-60 hover:opacity-100"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenedWidget(
                    openedWidget === OpenedWidgetEnum.WALLET
                      ? null
                      : OpenedWidgetEnum.WALLET
                  );
                }}
              >
                <span className={provider ? "" : "filter grayscale"}>
                  <UserLabel
                    user={user ? user : ({ address: accounts[0] } as User)}
                  />
                  <Emoji emoji={"🦊"} />
                </span>
              </summary>
              {openedWidget === OpenedWidgetEnum.WALLET ? (
                <div className={widgetClass + " right-0"}>
                  <Wallet />
                </div>
              ) : (
                ""
              )}
            </details>
          </span>
        </div>
      </div>
    </div>
  );
};
