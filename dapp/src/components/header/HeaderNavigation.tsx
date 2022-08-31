import { ApolloConsumer, ApolloClient, useQuery } from "@apollo/react-hooks";
import { Board, Thread, Block } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Router } from "router";
import {
  BoardLink,
  TimeTravelWidget,
  WatchedThreadsWidget
} from "components";
import OverlayComponent from "components/OverlayComponent";
import SettingsWidget from "components/SettingsWidget";

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {}

enum OpenedWidgetEnum {
  TIMETRAVEL = "TIMETRAVEL",
  SEARCH = "SEARCH",
  WATCHEDTHREADS = "WATCHEDTHREADS",
  SETTINGS = "SETTINGS",
}

const siteCreatedAtBlock: Block = {
  id: "0x04eeaa77c96947c5efca4abd8e3f8de005369390409d79dfef81aa983eb69e89",
  number: "17766365",
  timestamp: "1628450632",
};

type StartBlock = {
  label: string,
  block: Block,
};

const SettingsWidgetOverlay = OverlayComponent(SettingsWidget);

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
  const [startBlock, setStartBlock] = useState<StartBlock>({
    label: "Site creation",
    block: siteCreatedAtBlock,
  });
  const [openedWidget, setOpenedWidget] = useState<OpenedWidgetEnum | null>(
    null
  );
  const timeTravelRef = useRef<HTMLElement>(null);
  const watchedThreadsRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!thread && !board) {
      // persist the current start block until we know it's actually changed
      // this is to prevent the time travel range jumping around every time
      // the user time travels
      return;
    }
    setStartBlock(
      thread
        ? {label: "Thread creation", block: thread.createdAtBlock
       }
      : board
        ? {label: "Board creation", block: board.createdAtBlock
       }
      : {label: "Site creation", block: siteCreatedAtBlock}
    );
  }, [thread, board, setStartBlock]);

  const { data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST_MOST_POPULAR,
    { variables: {}, pollInterval: 30_000 }
  );

  const boards = data?.boards;
  return (
    <div className="mb-8 dchan-header-navigation">
      <div className="text-sm p-01 border-solid border-bottom-tertiary-accent bg-secondary border-0 border-b-2 text-left fixed top-0 left-0 right-0 shadow-md z-50">
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1">
          [
          <Link
            className="dchan-link"
            to={`/${block ? `?block=${block}` : ""}`}
          >
            dchan.network
          </Link>
          ]
        </span>
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1">
          <details className="inline">
            <summary className="inline">
              [
                <span className="dchan-link">+</span>
              ]
            </summary>
            <span className="inline">
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
                className="dchan-link"
                to={`${Router.boards()}${block ? `?block=${block}` : ""}`}
              >
                ...
              </Link>
              ]
            </span>
          </details>
        </span>
        <span className="text-black text-opacity-50 hover:text-opacity-100 pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.posts()}${block ? `?block=${block}` : ""}`}
          >
            🔍
          </Link>
          ]
        </span>
        <span className="float-right flex flex-row">
          <ApolloConsumer>
            {(client: ApolloClient<any>) => (
              <TimeTravelWidget
                client={client}
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
                startBlock={startBlock.block}
                dateTime={dateTime}
                startRangeLabel={startBlock.label}
              />
            )}
          </ApolloConsumer>
          <details
            className="w-full sm:relative mx-1"
            open={openedWidget === OpenedWidgetEnum.WATCHEDTHREADS}
            ref={watchedThreadsRef}
          >
            <summary
              className="list-none cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                setOpenedWidget(
                  openedWidget === OpenedWidgetEnum.WATCHEDTHREADS
                    ? null
                    : OpenedWidgetEnum.WATCHEDTHREADS
                );
              }}
            >
              👁
            </summary>
            <div className="absolute w-screen sm:w-max top-7 sm:top-full sm:mt-1 left-0 right-0 sm:left-auto sm:right-0">
              <WatchedThreadsWidget block={block} />
            </div>
          </details>
          <span
            ref={settingsRef}
            className="cursor-pointer mx-1"
            onClick={() => {
              setOpenedWidget(
                openedWidget === OpenedWidgetEnum.SETTINGS
                  ? null
                  : OpenedWidgetEnum.SETTINGS
              );
            }}
          >
            ⚙️
            {openedWidget === OpenedWidgetEnum.SETTINGS ? (
              <SettingsWidgetOverlay
                onExit={() => setOpenedWidget(null)}
                overlayClassName="w-full sm:w-4/6 h-5/6"
              />
            ) : (
              ""
            )}
          </span>
        </span>
      </div>
    </div>
  );
}
