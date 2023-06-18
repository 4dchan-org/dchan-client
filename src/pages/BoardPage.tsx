import { useLocalSettings, useTimeTravel } from "src/hooks";
import qs from "query-string";
import { Board, BoardRef, Thread } from "src/subgraph/types";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BOARD_GET, BOARD_CATALOG } from "src/subgraph/graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { isLowScore } from "src/subgraph/entities/thread";
import {
  Footer,
  ContentHeader,
  Loading,
  Anchor,
  CatalogView,
  IndexView,
  Paging,
  OpenedWidgetEnum,
} from "src/components";
import { Link, useParams } from "react-router-dom";
import { useTitle } from "react-use";
import { DateTime } from "luxon";
import { publish } from "pubsub-js";
import { ThemeContext } from "src/contexts/ThemeContext";
import { Router } from "src/router";

interface BoardCatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface BoardCatalogVars {
  board: string;
  block: number;
  limit: number;
  skip: number;
}

interface BoardData {
  board: Board;
  boardRef: BoardRef;
}
interface BoardVars {
  board: string;
  block: number;
}

export const BoardPage = () => {
  const params = useParams();
  const { board_id } = params;
  const { timeTraveledToBlockNumber, lastBlock } = useTimeTravel();
  const { currentBlock } = useTimeTravel();
  
  const query = qs.parse(location.search);
  const page = parseInt(`${query.page || "1"}`);

  const [settings] = useLocalSettings();
  const cutoff = useMemo(
    () =>
      Math.floor(
        (currentBlock
          ? parseInt(currentBlock.timestamp)
          : DateTime.now().toSeconds()) -
          60 * 60 * 24 * 30
      ),
    [currentBlock]
  );
  const [pageTheme, setPageTheme] = useContext(ThemeContext)

  const block = Number(timeTraveledToBlockNumber || lastBlock?.number);
  const boardMode: string =
    params.view_mode ||
    settings?.content_view?.board_default_view_mode ||
    "catalog";
  const orderBy =
    settings?.content_view?.board_sort_threads_by || "lastBumpedAt";
  const limit = parseInt(`${settings?.content_view?.page_size || "100"}`);

  const variables = {
    board: board_id || "",
    block,
    orderBy,
    orderDirection: settings?.content_view?.board_sort_direction || "desc",
    limit,
    skip: limit * (page - 1),
    cutoff,
  };

  const {
    refetch,
    data: catalogData,
    loading: catalogLoading,
  } = useQuery<BoardCatalogData, BoardCatalogVars>(BOARD_CATALOG, {
    variables,
  });

  const { loading: boardLoading, data: newBoardData } = useQuery<
    BoardData,
    BoardVars
  >(BOARD_GET, {
    skip: !block,
    variables: {
      board: board_id || "",
      block,
    },
  });

  const [boardData, setBoardData] = useState(newBoardData);
  useEffect(
    () => newBoardData && setBoardData(newBoardData),
    [newBoardData, setBoardData]
  );

  const board: Board | undefined | null = boardData?.board;
  const threads = useMemo(
    () => [...(catalogData?.pinned || []), ...(catalogData?.threads || [])],
    [catalogData]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [board?.id]);

  // useEffect(() => {
  //   if (board && board.name !== board_name) {
  //     navigate(`/${board.id}`, { replace: true });
  //   }
  // }, [board, board_name, history]);

  useEffect(() => {
    refetch();
  }, [block, orderBy, refetch]);

  const filteredThreads = (threads || []).filter((thread: Thread) => {
    return (
      settings?.content_filter?.show_below_threshold ||
      !isLowScore(thread, settings?.content_filter?.score_threshold)
    );
  });

  useTitle(
    !boardLoading
      ? board
        ? `/${board.name}/ - 4dchan.org - [${board.id}]`
        : `??? - 4dchan.org - [${board_id}]`
      : `Loading... - 4dchan.org - [${board_id}]`
  );

  useEffect(() => {
    if (!board) {
      // persist theme until we know for sure it's different for this board
      // this is to prevent the theme changing back to default for every
      // loading screen, e.g. during time travels or when switching between
      // boards
      return;
    }
    setPageTheme(board?.isNsfw ? "nsfw" : "blueboard");
  }, [board, setPageTheme]);

  const onTimeTravel = useCallback(() => {
    publish("WIDGET_OPEN", OpenedWidgetEnum.TIMETRAVEL);
  }, []);

  return (
    <div
      className="bg-primary min-h-100vh flex flex-col"
      data-theme={pageTheme}
    >
      <div>
        <ContentHeader
          board={board}
          summary={
            catalogLoading ? (
              <span>...</span>
            ) : (
              <span>
                Threads: {threads.length} (Hidden:{" "}
                {threads.length - filteredThreads.length}
                ), Posts: {board?.postCount}
              </span>
            )
          }
          onRefresh={refetch}
        />
        <div>
          {board === null ? (
            <div className="center grid p-8">
              <div className="text-xs p-2">{board_id}</div>
              <br />
              Board does not exist.
              {!isNaN(block) ? (
                <>
                  <br />
                  You may have time traveled to before it was created, or after
                  it was deleted.
                </>
              ) : (
                ""
              )}
            </div>
          ) : catalogLoading && !catalogData ? (
            <div className="center grid">
              <Loading />
            </div>
          ) : board && threads ? (
            threads.length === 0 ? (
              <>
                <div className="center grid p-8">No threads.</div>
                <div className="center grid p-8">
                  <button
                    className="dchan-link dchan-brackets p-2"
                    onClick={onTimeTravel}
                  >
                    Time Travel
                  </button>
                  <Link
                    className="dchan-link dchan-brackets p-2"
                    to={Router.board(board, "archive") ?? ""}
                  >
                    Archive
                  </Link>
                </div>
              </>
            ) : (
              <div>
                {(
                  {
                    catalog: () => (
                      <CatalogView board={board} threads={filteredThreads} />
                    ),
                    index: () => (
                      <IndexView board={board} threads={filteredThreads} />
                    ),
                  }[boardMode] || (() => <></>)
                )()}
              </div>
            )
          ) : (
            <div />
          )}

          {board ? (
            <div>
              <hr />
              <Paging
                url={location.pathname}
                page={page}
                hasNextPage={threads.length >= limit}
              />

              <Anchor to="#board-header" label="Top" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
};
