import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import PostComponent from "components/post/Post";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import CATALOG_TIMETRAVEL from "dchan/graphql/queries/catalog_tt";
import { Board, Post, Thread, Timestamp } from "dchan";
import Loading from "components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLink, HashLink as Link } from "react-router-hash-link";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";
import useInterval from "@use-it/interval";
import { useThrottleCallback } from "@react-hook/throttle";
import {
  isLowScore as isLowScoreThread,
  sortByCreatedAt as sortThreadsByCreatedAt,
} from "dchan/entities/thread";
import {
  isLowScore as isLowScorePost,
  sortByCreatedAt as sortPostsByCreatedAt,
} from "dchan/entities/post";
import { fromBigInt } from "dchan/entities/datetime";

interface CatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
  postSearch: Post[];
}
interface CatalogVars {
  boardId: string;
  currentBlock?: number;
  limit: number;
  search: string;
}

export default function CatalogPage({
  match: {
    params: { boardId: boardIdParam },
  },
}: any) {
  const boardId = `0x${boardIdParam}`;
  const [showLowScore, setShowLowScore] = useState<boolean>(false); // @TODO config
  const [isTimeTravelPanelOpen, setTimeTravelPanelOpen] =
    useState<boolean>(false); // @TODO config
  const [search, setSearch] = useState<string>("");
  const [currentBlock, setCurrentBlock] = useState<number | undefined>(
    undefined
  );
  const [timeTravelRange, setTimeTravelRange] = useState<{
    min?: Timestamp;
    max?: Timestamp;
  }>({});
  const onSearchChange = (e: any) => setSearch(e.target.value);

  const variables = {
    ...{
      boardId,
      limit: 25,
      search: search.length > 1 ? `${search}:*` : "",
    },
    ...(currentBlock ? { currentBlock } : {}),
  };

  const { refetch, loading, data } = useQuery<CatalogData, CatalogVars>(
    !currentBlock ? CATALOG : CATALOG_TIMETRAVEL,
    {
      variables,
      pollInterval: 60_000,
    }
  );

  const postSearch = data?.postSearch;
  const board = data?.board;
  const threads = useMemo(
    () => [...(data?.pinned || []), ...(data?.threads || [])],
    [data]
  );

  const sortedPostSearch = useMemo(() => {
    return postSearch ? sortPostsByCreatedAt(postSearch) : undefined;
  }, [postSearch]);

  const sortedThreads = useMemo(() => {
    return sortThreadsByCreatedAt(threads)
  }, [threads])

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );
  const [lastBumpedAtShort, setLastBumpedAtShort] = useState<string>("");
  useEffect(() => {
    board &&
      setLastBumpedAtShort(
        fromBigInt(board.lastBumpedAt).toLocaleString(DateTime.DATETIME_SHORT)
      );
  }, [board, setLastBumpedAtShort]);

  const [lastRefreshedRelative, setLastRefreshedAtRelative] =
    useState<string>("");

  const refresh = useCallback(async () => {
    try {
      await refetch({
        boardId,
      });
      setLastRefreshedAt(DateTime.now());
    } catch (e) {
      console.error({ refreshError: e });
    }
  }, [boardId, refetch, setLastRefreshedAt]);

  const onRefresh = useThrottleCallback(refresh, 1, true);

  const history = useHistory();
  const [focused, setFocused] = useState<string>("");

  const onFocus = useCallback(
    (focusId: string) => {
      if (focused === focusId && focusId.indexOf("0x") === 0 && !!board) {
        history.push(`/${board.name}/${board.id}/${focusId}`);
      } else {
        setFocused(focusId);
      }
    },
    [board, focused, history, setFocused]
  );

  const toggleTimeTravelPanel = useCallback(() => {
    setTimeTravelPanelOpen(!isTimeTravelPanelOpen);
  }, [isTimeTravelPanelOpen, setTimeTravelPanelOpen]);

  // Time travel
  const onTimeTravel = useThrottleCallback(
    useCallback(
      (e) => {
        setCurrentBlock(parseInt(e.target.value));
      },
      [setCurrentBlock]
    ),
    10,
    true
  );

  useEffect(() => {
    if (board?.createdAtBlock && currentBlock === undefined) {
      const lastThread = sortedThreads ? sortedThreads[0] : undefined;

      // setCurrentBlock(lastCreatedAtBlock)
      setTimeTravelRange({
        min: {
          block: board?.createdAtBlock,
          unix: board?.createdAt,
        },
        max: {
          block: lastThread?.createdAtBlock || "",
          unix: lastThread?.createdAt || "",
        },
      });
    }
  }, [board, sortedThreads, currentBlock, setCurrentBlock, setTimeTravelRange]);

  // Last refreshed
  const refreshLastRefreshedAtRelative = useCallback(() => {
    setLastRefreshedAtRelative(lastRefreshedAt.toRelative() || "");
  }, [lastRefreshedAt, setLastRefreshedAtRelative]);

  useEffect(() => {
    refreshLastRefreshedAtRelative();
  }, [lastRefreshedAt, refreshLastRefreshedAtRelative]);

  useInterval(() => {
    refreshLastRefreshedAtRelative();
  }, 1_000);

  return (
    <div
      className="bg-primary min-h-100vh"
      dchan-board={board?.name}
      data-theme={board?.isNsfw ? "nsfw" : "blueboard"}
    >
      <BoardHeader board={board}></BoardHeader>

      <FormPost board={board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="text-center sm:text-left sm:flex">
        <div className="mx-2 flex center">
          <span className="mx-1">
            [
            <HashLink
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              to="#bottom"
            >
              Bottom
            </HashLink>
            ]
          </span>
          {!currentBlock ? (
            <span className="mx-1">
              [
              <button
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                onClick={onRefresh}
              >
                {lastRefreshedRelative}
              </button>
              ]
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="flex-grow"></div>
        <div className="mx-2 sm:text-center sm:text-right sm:flex sm:items-center sm:justify-end">
          {timeTravelRange.min && timeTravelRange.max ? (
            <details
              className="mx-1 sm:text-right"
              open={isTimeTravelPanelOpen}
            >
              <summary>
                [
                <button
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  onClick={toggleTimeTravelPanel}
                >
                  Time Travel
                </button>
                ]
              </summary>
              <div className="text-xs">
                <div className="flex center">
                  <span className="mx-1">Board creation</span>
                  <input
                    id="timetravel"
                    type="range"
                    min={parseInt(timeTravelRange.min.block)}
                    max={parseInt(timeTravelRange.max.block)}
                    onChange={onTimeTravel}
                    value={
                      currentBlock ||
                      sortedThreads?.[0]?.createdAtBlock ||
                      ""
                    }
                  />{" "}
                  <span className="mx-1">Now</span>
                </div>
                <div className="grid center grid-cols-3 text-center">
                  <span className="mx-1">
                    {fromBigInt(timeTravelRange.min.unix).toLocaleString(
                      DateTime.DATE_SHORT
                    )}
                  </span>
                  <span>{currentBlock ? `Block n.${currentBlock}` : ""}</span>
                  <span className="mx-1">
                    {fromBigInt(timeTravelRange.max.unix).toLocaleString(
                      DateTime.DATE_SHORT
                    )}
                  </span>
                </div>
              </div>
            </details>
          ) : (
            ""
          )}
          {lastBumpedAtShort ? (
            <span>
              {currentBlock ? (
                <div className="mx-1 text-xs">Time traveled to</div>
              ) : (
                ""
              )}
              <div className="mx-1 text-xs">[{lastBumpedAtShort}]</div>
              {currentBlock ? (
                <div>
                  [
                  <button
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500 text-xs"
                    onClick={() => setCurrentBlock(undefined)}
                  >
                    Return to present
                  </button>
                  ]
                </div>
              ) : (
                ""
              )}
            </span>
          ) : (
            ""
          )}
          <div className="mx-1 text-center">
            <div className="relative">
              <label htmlFor="search">Search: </label>
              {search ? <button onClick={() => setSearch("")}>X</button> : ""}
            </div>
            <div>
              <input
                id="search"
                className="text-center w-32"
                type="text"
                placeholder="..."
                value={search}
                onChange={onSearchChange}
              ></input>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>

      <div>
        {loading ? (
          <Loading className="p-4"></Loading>
        ) : search ? (
          postSearch && postSearch.length ? (
            <div>
              <div>
                <div className="text-center">
                  <details className="pb-1">
                    <summary className="text-xs text-gray-600">
                      Found: {postSearch.length} posts (Hidden:{" "}
                      {postSearch.filter((p) => isLowScorePost(p)).length})
                    </summary>
                    <div>
                      <input
                        id="dchan-input-show-reported"
                        className="mx-1 text-xs whitespace-nowrap opacity-50 hover:opacity-100"
                        type="checkbox"
                        checked={showLowScore}
                        onChange={() => setShowLowScore(!showLowScore)}
                      ></input>
                      <label htmlFor="dchan-input-show-reported">
                        Show hidden threads
                      </label>
                    </div>
                  </details>
                </div>
              </div>
              <div>
                {sortedPostSearch?.map((post) => (
                  <div className="p-2 flex flex-wrap">
                    <PostComponent
                      post={post}
                      header={
                        <span className="p-2">
                          [
                          <Link
                            to={`/${post.id}`}
                            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                          >
                            View
                          </Link>
                          ]
                        </span>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            "No results"
          )
        ) : board && threads ? (
          threads.length === 0 ? (
            <div className="center grid">{`No threads.`}</div>
          ) : (
            <div>
              <div className="text-center">
                <details className="pb-1">
                  <summary className="text-xs text-gray-600">
                    Threads: {threads.length} (Hidden:{" "}
                    {threads.filter((t) => isLowScoreThread(t)).length}),
                    Messages: {board?.postCount}
                  </summary>
                  <div>
                    <input
                      id="dchan-input-show-reported"
                      className="mx-1 text-xs whitespace-nowrap opacity-50 hover:opacity-100"
                      type="checkbox"
                      checked={showLowScore}
                      onChange={() => setShowLowScore(!showLowScore)}
                    ></input>
                    <label htmlFor="dchan-input-show-reported">
                      Show hidden threads
                    </label>
                  </div>
                </details>
              </div>
              <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
                {threads
                  .filter((thread: Thread) => {
                    return showLowScore || !isLowScoreThread(thread);
                  })
                  .map((thread: Thread) => (
                    <CatalogThread
                      onFocus={onFocus}
                      isFocused={focused === thread.id}
                      thread={thread}
                      key={thread.id}
                    ></CatalogThread>
                  ))}
              </div>

              <div>
                <Link
                  to="#board-header"
                  className="inline bg-secondary rounded-full"
                >
                  ⤴️
                </Link>
              </div>
            </div>
          )
        ) : (
          "Board not found"
        )}
      </div>

      <div id="bottom" />
      <Footer></Footer>
    </div>
  );
}
