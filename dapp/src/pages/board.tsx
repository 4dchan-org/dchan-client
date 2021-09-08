import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import { Board, Thread } from "dchan";
import { useEffect, useMemo } from "react";
import { Router } from "router";
import BOARD_CATALOG from "graphql/queries/board_catalog";
import useSettings from "hooks/useSettings";
import { useQuery } from "@apollo/react-hooks";
import { isLowScore } from "dchan/entities/thread";
import ContentHeader from "components/ContentHeader";
import Loading from "components/Loading";
import Anchor from "components/Anchor";
import CatalogView from "components/CatalogView";
import Post from "components/post/Post";
import { Link, useHistory } from "react-router-dom";
import { useTitle } from "react-use";
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

export default function BoardPage({ location, match: { params } }: any) {
  let { board_id } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const { lastBlock } = useLastBlock();
  const query = parseQueryString(location.search);
  const page = parseInt(`${query.page || "0"}`);
  const block = parseInt(`${query.block || lastBlock?.number || "0"}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const history = useHistory();
  const [settings] = useSettings();
  const orderBy =
    settings?.content_view?.board_sort_threads_by || "lastBumpedAt";
  const limit = parseInt(`${settings?.content_view?.page_size || "100"}`);

  const variables = {
    board: board_id,
    block,
    orderBy,
    orderDirection: settings?.content_view?.board_sort_direction || "desc",
    limit,
    skip: limit * page,
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
  const maxPage = Math.max(
    Math.ceil(board ? parseInt(`${board.threadCount}`) / limit : 0) - 1,
    0
  );

  useTitle(
    board
      ? `/${board.name}/ - dchan.network - [${board.id}]`
      : `/${board_id}/ - Loading... - dchan.network`
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
            <div className="center grid min-h-50vh">
              <Loading />
            </div>
          ) : board && threads ? (
            threads.length === 0 ? (
              <div className="center grid p-8">{`No threads.`}</div>
            ) : (
              <div>
                {{
                  catalog: (
                    <CatalogView threads={filteredThreads} block={block} />
                  ),
                  threads: (
                    <div>
                      {threads.map((thread) => {
                        return (
                          <div className="border-solid border-black py-2 border-b border-secondary">
                            <Post
                              post={thread.op}
                              thread={thread}
                              key={thread.op.id}
                              header={
                                <span>
                                  <span className="p-1">
                                    [
                                    <Link
                                      to={`${Router.thread(thread)}${
                                        block ? `?block=${block}` : ""
                                      }`}
                                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                                    >
                                      Reply
                                    </Link>
                                    ]
                                  </span>
                                </span>
                              }
                            >
                              <div className="text-left pl-8">
                                {parseInt(thread.replyCount) >
                                1 + thread.replies.length ? (
                                  <Link
                                    to={`${Router.thread(thread)}${
                                      block ? `?block=${block}` : ""
                                    }`}
                                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                                  >
                                    +{" "}
                                    {parseInt(thread.replyCount) -
                                      thread.replies.length}{" "}
                                    replies omitted
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </div>
                              {[...thread.replies].reverse().map((post) => (
                                <Post
                                  post={post}
                                  thread={thread}
                                  key={post.id}
                                />
                              ))}
                            </Post>
                          </div>
                        );
                      })}
                    </div>
                  ),
                }[boardMode || "catalog"] ||
                  `Invalid view mode: "${boardMode}"`}
              </div>
            )
          ) : (
            <div />
          )}

          {board ? (
            <div>
              <div>
                <span>
                  {page > 0 ? (
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      to={`${Router.board(board)}?page=${0}${
                        block ? `&block=${block}` : ""
                      }`}
                    >
                      &lt;&lt;
                    </Link>
                  ) : (
                    ""
                  )}
                </span>
                <span>
                  {page > 0 ? (
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      to={`${Router.board(board)}?page=${page - 1}${
                        block ? `&block=${block}` : ""
                      }`}
                    >
                      &lt;
                    </Link>
                  ) : (
                    ""
                  )}
                </span>
                <span>
                  [
                  <button
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                    onClick={() => {
                      const input = prompt(
                        `Page number: (range: 0-${maxPage})`
                      );
                      const newPage = parseInt(input || "");
                      if (isNaN(newPage) || newPage < 0 || newPage > maxPage) {
                        alert(`Invalid page number: ${input}`);
                      } else {
                        history.push(
                          `${Router.board(board)}?page=${newPage}${
                            block ? `&block=${block}` : ""
                          }`
                        );
                      }
                    }}
                  >
                    Page {page} of {maxPage}
                  </button>
                  ]
                </span>
                <span>
                  {page < maxPage ? (
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      to={`${Router.board(board)}?page=${page + 1}${
                        block ? `&block=${block}` : ""
                      }`}
                    >
                      &gt;
                    </Link>
                  ) : (
                    ""
                  )}
                </span>
                <span>
                  {page < maxPage ? (
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-2"
                      to={`${Router.board(board)}?page=${maxPage}${
                        block ? `&block=${block}` : ""
                      }`}
                    >
                      &gt;&gt;
                    </Link>
                  ) : (
                    ""
                  )}
                </span>
              </div>

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
}
