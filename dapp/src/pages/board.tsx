import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import { Board, Thread } from "dchan";
import { useEffect, useMemo } from "react";
import { Router } from "router";
import BOARD_CATALOG from "dchan/graphql/queries/board_catalog";
import useSettings from "hooks/useSettings";
import { useQuery } from "@apollo/react-hooks";
import { isLowScore } from "dchan/entities/thread";
import ContentHeader from "components/ContentHeader";
import Loading from "components/Loading";
import Anchor from "components/Anchor";
import BoardCatalogView from "components/BoardCatalogView";
import Post from "components/post/Post";
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

  const { lastBlock } = useLastBlock();
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block || lastBlock?.number || "0"}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const [settings] = useSettings();
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

  useEffect(() => {
    refetch();
  }, [block, orderBy, refetch]);

  const filteredThreads = (threads || []).filter((thread: Thread) => {
    return (
      settings?.content_filter?.show_below_threshold ||
      !isLowScore(thread, settings?.content_filter?.score_threshold)
    );
  });

  const boardMode = settings?.content_view?.board_view_mode;

  console.log({ boardMode });

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
                {{
                  catalog: (
                    <BoardCatalogView board={board} threads={filteredThreads} />
                  ),
                  threads: (
                    <div>
                      {threads.map((thread) => {
                        return (
                          <div className="border-solid border-bottom border-bottom-secondary py-2 border-top-1">
                            {[thread.op, ...thread.replies].map((post) => (
                              <Post post={post} thread={thread} key={post.id} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ),
                }[boardMode || "catalog"] ||
                  `Invalid view mode: "${boardMode}"`}

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
