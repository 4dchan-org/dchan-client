import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import PostComponent from "components/post/Post";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import CATALOG_TIMETRAVEL from "dchan/graphql/queries/catalog_tt";
import { Board, Post, Thread, Timestamp, Block } from "dchan";
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
import BLOCK_BY_DATE from "dchan/graphql/queries/block_by_date";
import useSettings from "hooks/useSettings";

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

interface BlockByDateData {
  blocks: Block[];
}
interface BlockByDateVars {
  timestampMin: string;
  timestampMax: string;
}

export default function CatalogPage({ match: { params } }: any) {
  const { boardId: boardIdParam } = params;
  const boardId = `0x${boardIdParam}`;
  const [settings, setSettings] = useSettings();
  const [showLowScore, setShowLowScore] = useState<boolean>(false); // @TODO config
  const [search, setSearch] = useState<string>(params.search || "");
  const [currentDate, setCurrentDate] = useState<DateTime | undefined>(
    undefined
  );
  const [currentBlock, setCurrentBlock] = useState<number | undefined>(
    undefined
  );
  const [timeTravelRange, setTimeTravelRange] = useState<{
    min: Timestamp;
    max: Timestamp;
  }>();
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
  const { data: bbdData } = useQuery<BlockByDateData, BlockByDateVars>(
    BLOCK_BY_DATE,
    {
      variables: {
        timestampMin: `${currentDate?.toSeconds() || "0"}`,
        timestampMax: `${(currentDate?.toSeconds() || 0) + 1_000_000}`,
      },
      skip: !currentDate,
    }
  );

  useEffect(() => {
    if (currentDate) {
      const block = bbdData?.blocks[0].number || "";
      !!block && setCurrentBlock(parseInt(block));
    }
  }, [currentDate, bbdData, setCurrentBlock]);

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
    return sortThreadsByCreatedAt(threads);
  }, [threads]);

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );
  const [lastBumpedAt, setLastBumpedAt] = useState<DateTime>();
  useEffect(() => {
    if (!board) return;

    setLastBumpedAt(fromBigInt(board.lastBumpedAt));
  }, [board, setLastBumpedAt]);

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

  // Time travel
  const onTimeTravelByBlock = useThrottleCallback(
    useCallback(
      (e) => {
        setCurrentBlock(parseInt(e.target.value));
        setCurrentDate(undefined);
      },
      [setCurrentBlock]
    ),
    10,
    true
  );

  useEffect(() => {
    const lastThread = sortedThreads ? sortedThreads[0] : undefined;
    if (board?.createdAtBlock && currentBlock === undefined) {
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

  const filteredThreads = useMemo(
    () =>
      threads
        .filter((thread: Thread) => {
          return (
            showLowScore ||
            !isLowScoreThread(thread, settings.content.score_threshold)
          );
        })
        .map((thread: Thread) => (
          <CatalogThread
            onFocus={onFocus}
            isFocused={focused === thread.id}
            thread={thread}
            key={thread.id}
          ></CatalogThread>
        )),
    [threads, settings, focused, onFocus, showLowScore]
  );

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
          {timeTravelRange && lastBumpedAt ? (
            <span>
              {currentBlock ? (
                <div className="mx-1 text-xs">
                  <abbr title="You're currently viewing a past version of the board. The content is displayed as it was shown to users at the specified date.">
                    Time traveled to
                  </abbr>
                </div>
              ) : (
                ""
              )}
              <details className="mx-1 sm:text-right" open={!!currentBlock}>
                <summary>
                  <span className="mx-1 text-xs">
                    [
                    <input
                      required
                      type="date"
                      id="dchan-timetravel-date-input"
                      value={(currentDate || DateTime.now()).toISODate()}
                      onChange={(e) => {
                        setCurrentDate(DateTime.fromISO(e.target.value));
                        setCurrentBlock(undefined);
                      }}
                      min={fromBigInt(timeTravelRange.min.unix).toISODate()}
                      max={fromBigInt(timeTravelRange.max.unix).toISODate()}
                    ></input>
                    , {lastBumpedAt.toLocaleString(DateTime.TIME_SIMPLE)}]
                  </span>
                </summary>
                <div className="text-xs">
                  <div className="flex center">
                    <span className="mx-1">Board creation</span>
                    <input
                      id="timetravel"
                      type="range"
                      min={parseInt(timeTravelRange.min.block)}
                      max={parseInt(timeTravelRange.max.block)}
                      onChange={onTimeTravelByBlock}
                      value={
                        currentBlock || sortedThreads?.[0]?.createdAtBlock || ""
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
              {currentBlock ? (
                <div className="text-xs">
                  [
                  <button
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    onClick={() => {
                      setCurrentBlock(undefined);
                      setCurrentDate(undefined);
                    }}
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
              {search ? (
                <span className="text-xs">
                  [
                  <button
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    onClick={() => setSearch("")}
                  >
                    Cancel
                  </button>
                  ]
                </span>
              ) : (
                ""
              )}
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
                    <summary className="text-xs text-gray-600 [y=">
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
                            onClick={() => {
                              !!board &&
                                history.push(
                                  `/${board.name}/${board.id}/${search}`
                                );
                              console.log({ board });
                            }}
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
                  <summary className="text-xs text-gray-600 pb-2">
                    Threads: {threads.length} (Hidden:{" "}
                    {
                      threads.filter((t) =>
                        isLowScoreThread(t, settings.content.score_threshold)
                      ).length
                    }
                    ), Messages: {board?.postCount}
                  </summary>
                  <div className="center grid">
                    <div className="bg-secondary p-2">
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
                      <div>
                        <label htmlFor="dchan-input-show-reported">
                          Score hide threshold
                        </label>
                        <div>
                          <input
                            id="dchan-input-show-reported"
                            className="mx-1 text-xs whitespace-nowrap opacity-50 hover:opacity-100"
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={settings.content.score_threshold}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                content: { score_threshold: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="text-sm">
                          {
                            {
                              "0": "Show everything",
                              "0.1": "Hide reported content",
                              "0.2": "Hide reported content",
                              "0.3": "Hide reported content",
                              "0.4": "Hide reported content",
                              "0.5": "Hide reported content",
                              "0.6": "Hide reported content",
                              "0.7": "Hide reported content",
                              "0.8": "Hide reported content",
                              "0.9": "Hide reported content",
                              "1": "Only show content with no reports",
                            }[settings.content.score_threshold]
                          }
                        </div>
                        <div className="text-xs">
                          Content score is estimated based on quantity of user
                          reports and janitor actions.
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
              <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
                {filteredThreads}
              </div>

              <div className="flex center">
                [
                <HashLink
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  to="#board-header"
                >
                  Top
                </HashLink>
                ]
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
