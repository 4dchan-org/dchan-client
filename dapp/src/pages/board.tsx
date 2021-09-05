import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import CatalogThread from "components/catalog/CatalogThread";
import { Board, Thread } from "dchan";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Router } from "router";
import BOARD_CATALOG from "dchan/graphql/queries/board_catalog";
import useSettings from "hooks/useSettings";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { isLowScore } from "dchan/entities/thread";
import ContentHeader from "components/ContentHeader";
import Loading from "components/Loading";
import Anchor from "components/Anchor";
interface BoardCatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface BoardCatalogVars {
  board: string;
  block: number;
}

export default function BoardPage({ location, match: { params } }: any) {
  let { board_id } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const lastBlock = useLastBlock();
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block || lastBlock?.number || "0"}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const [settings] = useSettings();
  const [focused, setFocused] = useState<Thread | undefined>(undefined);
  const history = useHistory();
  const orderBy =
    settings?.content_view?.board_sort_threads_by || "lastBumpedAt";
  const variables = {
    board: board_id,
    block,
    orderBy,
  };

  const { refetch, data, loading } = useQuery<
    BoardCatalogData,
    BoardCatalogVars
  >(BOARD_CATALOG, {
    variables,
    pollInterval: 60_000,
  });

  const board = data?.board;
  const threads = useMemo(
    () => [...(data?.pinned || []), ...(data?.threads || [])],
    [data]
  );

  const onFocus = useCallback(
    (newFocused: Thread) => {
      if (focused === newFocused && !!board) {
        const url = Router.thread(newFocused);
        url && history.push(url);
      } else {
        setFocused(newFocused);
      }
    },
    [board, focused, history, setFocused]
  );

  useEffect(() => {
    refetch();
  }, [block, orderBy, refetch]);

  const filteredThreads = useMemo(
    () =>
      (threads || [])
        .filter((thread: Thread) => {
          return (
            settings?.content_filter?.show_below_threshold ||
            !isLowScore(thread, settings?.content_filter?.score_threshold)
          );
        })
        .map((thread: Thread) => (
          <CatalogThread
            onFocus={(e) => onFocus(thread)}
            isFocused={true === (focused && focused.n === thread.n)}
            thread={thread}
            key={thread.id}
          ></CatalogThread>
        )),
    [threads, settings, focused, onFocus]
  );

  return (
    <div className="bg-primary min-h-100vh">
      <div>
        <ContentHeader
          board={board}
          block={block}
          dateTime={dateTime}
          baseUrl={board ? Router.board(board) : undefined}
          summary={
            loading ? (
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
          {loading ? (
            <div className="center grid">
              <Loading />
            </div>
          ) : board && threads ? (
            threads.length === 0 ? (
              <div className="center grid">{`No threads.`}</div>
            ) : (
              <div>
                <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
                  {filteredThreads}
                </div>

                <Anchor to="#board-header" label="Top" />
              </div>
            )
          ) : (
            <div />
          )}
        </div>
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
