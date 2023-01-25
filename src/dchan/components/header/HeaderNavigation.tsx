import { useQuery } from "@apollo/react-hooks";
import { Board, Thread, Block } from "dchan/subgraph/types";
import { BOARDS_LIST_MOST_POPULAR } from "dchan/subgraph/graphql/queries";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Router } from "router";
import {
  BoardLink,
  TimeTravelWidget,
  WatchedThreadsWidget,
  Emoji,
  SettingsWidget,
  Overlay,
  WalletConnect,
  UserLabel,
} from "dchan/components";
import useTimeTravel from "dchan/hooks/useTimeTravel";
import { useUser, useWeb3 } from "dchan/hooks";

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {}

enum OpenedWidgetEnum {
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
  const { provider } = useWeb3();
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const [startBlock, setStartBlock] = useState<StartBlock>({
    label: "Site creation",
    block: siteCreatedAtBlock,
  });
  const [openedWidget, setOpenedWidget] = useState<OpenedWidgetEnum | null>(
    null
  );
  const [showBoards, setShowBoards] = useState<boolean>(false);
  const timeTravelRef = useRef<HTMLDetailsElement>(null);
  const watchedThreadsRef = useRef<HTMLDetailsElement>(null);
  const settingsRef = useRef<HTMLDetailsElement>(null);
  const walletRef = useRef<HTMLDetailsElement>(null);

  const user = useUser().data?.user;

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
    BOARDS_LIST_MOST_POPULAR,
    { variables: {}, pollInterval: 30_000 }
  );

  const toggleShowBoards = useCallback(() => {
    setShowBoards(!showBoards);
  }, [showBoards, setShowBoards]);

  const widgetClass = [
    "absolute top-0 w-screen sm:w-max mt-1 md:mt-1 left-0 right-0 sm:left-auto sm:right-2 sm:opacity-60 hover:opacity-100",
    showBoards ? "top-11 md:top-full" : "top-full md:top-6",
  ].join(" ");

  const boards = data?.boards;
  return (
    <div className="mb-8 dchan-header-navigation">
      <div className="text-sm p-01 border-solid border-bottom-tertiary-accent bg-secondary border-0 border-b-2 text-left fixed top-0 left-0 right-0 shadow-md z-50">
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1 dchan-brackets">
          <Link
            className="dchan-link"
            to={`/${block ? `?block=${block}` : ""}`}
          >
            dchan.network
          </Link>
        </span>
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1">
          <span className="inline dchan-brackets" onClick={toggleShowBoards}>
            <span className="dchan-link">+</span>
          </span>
          <span className={showBoards ? "hidden md:inline" : "hidden"}>
            <span className="hidden sm:inline-block dchan-brackets">
              {!!boards &&
                boards.map((board) => (
                  <span className="dchan-navigation-board" key={board.id}>
                    <wbr />
                    <BoardLink board={board} />
                  </span>
                ))}
            </span>
          </span>
          <Link
            className={"dchan-brackets " + (showBoards ? "" : "hidden")}
            to={`${Router.boards()}${block ? `?block=${block}` : ""}`}
          >
            <span className="dchan-link">...</span>
          </Link>
        </span>
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.posts()}${block ? `?block=${block}` : ""}`}
          >
            <Emoji emoji={"🔍"} />
          </Link>
          ]
        </span>
        <span className="float-right flex flex-row mx-1">
          <TimeTravelWidget
            ref={timeTravelRef}
            open={openedWidget === OpenedWidgetEnum.TIMETRAVEL}
            widgetClassName={widgetClass}
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
          <details
            className="mx-1"
            title="Watched Threads"
            open={openedWidget === OpenedWidgetEnum.WATCHEDTHREADS}
            ref={watchedThreadsRef}
          >
            <summary
              className="list-none cursor-pointer opacity-60 hover:opacity-100"
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
            <div className={widgetClass}>
              <WatchedThreadsWidget />
            </div>
          </details>
          <span
            ref={settingsRef}
            title={"Settings"}
            className="cursor-pointer opacity-60 hover:opacity-100 mx-1"
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
            className="mx-1"
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
                {user ? <UserLabel user={user} /> : ""}
                <Emoji emoji={"🦊"} />
              </span>
            </summary>
            {openedWidget === OpenedWidgetEnum.WALLET ? (
              <div className={widgetClass}>
                <div className="bg-secondary border border-tertiary-accent border-solid p-1">
                  <WalletConnect />
                </div>
              </div>
            ) : (
              ""
            )}
          </details>
        </span>
        <div
          className={
            "w-min top-7 sm:top-full sm:mt-1 left-0 right-0 sm:left-auto mx-auto " +
            (showBoards ? "block md:hidden" : "hidden")
          }
        >
          <span className="dchan-brackets flex">
            {!!boards &&
              boards.map((board) => (
                <span className="dchan-navigation-board" key={board.id}>
                  <wbr />
                  <BoardLink board={board} />
                </span>
              ))}
          </span>
        </div>
      </div>
    </div>
  );
};
