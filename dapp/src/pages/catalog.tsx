import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import PostComponent from "components/post/Post";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import CATALOG_TIMETRAVEL from "dchan/graphql/queries/catalog_tt";
import { Board, Post, Thread, Block } from "dchan";
import Loading from "components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLink, HashLink as Link } from "react-router-hash-link";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";
import useInterval from "@use-it/interval";
import { useThrottleCallback } from "@react-hook/throttle";
import { isLowScore as isLowScoreThread } from "dchan/entities/thread";
import {
  sortByCreatedAt as sortPostsByCreatedAt,
} from "dchan/entities/post";
import { fromBigInt } from "dchan/entities/datetime";
import BLOCK_BY_DATE from "dchan/graphql/queries/block_by_date";
import useSettings from "hooks/useSettings";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { useTitle } from "react-use";
import SearchWidget from "components/SearchWidget";
import { Router } from "router";
import FilterSettings from "components/FilterSettings";
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
interface TimeTravelRange {
  min: Block;
  max: Block;
}

export default function CatalogPage({ location, match: { params } }: any) {
  const { boardId: boardIdParam } = params;
  const query = parseQueryString(location.search);
  const boardId = `0x${boardIdParam}`;
  const history = useHistory();
  const s = query.s || query.search
  const [search, setSearch] = useState<string>(
    isString(s) ? s : ""
  );
  const [currentDate, setCurrentDate] = useState<DateTime | undefined>(
    undefined
  );
  const [currentBlock, setCurrentBlock] = useState<number | undefined>(
    isString(query.block) ? parseInt(query.block) : undefined
  );
  const [timeTravelRange, setTimeTravelRange] = useState<TimeTravelRange>();

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

  const lastBlock = useLastBlock();

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
    return sortPostsByCreatedAt(postSearch ? postSearch.filter(post => {
      return post && post.thread && post.board
    }) : []);
  }, [postSearch]);

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );
  const [lastBumpedAt, setLastBumpedAt] = useState<Block>();
  useEffect(() => {
    if (!board) return;

    setLastBumpedAt(board.lastBumpedAtBlock);
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

  const [focused, setFocused] = useState<string>("");

  const onFocus = useCallback(
    (focusId: string) => {
      if (focused === focusId && !!board) {
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
        history.replace(
          `/${params.boardName}/0x${params.boardId}?block=${e.target.value}`
        );
      },
      [params, setCurrentBlock, setCurrentDate, history]
    ),
    10,
    true
  );

  const onReturnToPresent = useCallback(() => {
    setCurrentBlock(undefined);
    setCurrentDate(undefined);
    board && history.push(`/${board.name}/${board.id}`);
  }, [setCurrentBlock, setCurrentDate, history, board]);

  useEffect(() => {
    if (board && lastBlock) {
      setTimeTravelRange({
        min: board?.createdAtBlock,
        max: lastBlock,
      });
    }
  }, [board, lastBlock, setTimeTravelRange]);

  // AutoRefresh
  const refreshLastRefreshedAtRelative = useCallback(() => {
    if (lastRefreshedAt.diffNow().toMillis() === 0) {
      return;
    }

    setLastRefreshedAtRelative(lastRefreshedAt.toRelative() || "");
  }, [lastRefreshedAt, setLastRefreshedAtRelative]);

  useEffect(() => {
    refreshLastRefreshedAtRelative();
  }, [lastRefreshedAt, refreshLastRefreshedAtRelative]);

  useInterval(() => {
    refreshLastRefreshedAtRelative();
  }, 1_000);

  const [settings] = useSettings()

  const filteredThreads = useMemo(
    () =>
      threads
        .filter((thread: Thread) => {
          return (
            settings?.content?.show_below_threshold ||
            !isLowScoreThread(thread, settings?.content?.score_threshold)
          );
        })
        .map((thread: Thread) => (
          <CatalogThread
            onFocus={onFocus}
            isFocused={focused === thread.n}
            thread={thread}
            key={thread.id}
          ></CatalogThread>
        )),
    [threads, settings, focused, onFocus]
  );

  const [baseUrl, setBaseUrl] = useState<string>();
  useEffect(() => {
    board && setBaseUrl(Router.board(board));
  }, [board]);

  useTitle(`/${board?.name}/ - ${board?.title}`);

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
          {baseUrl ? (
            <SearchWidget
              baseUrl={baseUrl}
              search={search}
              setSearch={setSearch}
            />
          ) : (
            ""
          )}
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
                      min={fromBigInt(
                        timeTravelRange.min.timestamp
                      ).toISODate()}
                      max={fromBigInt(
                        timeTravelRange.max.timestamp
                      ).toISODate()}
                    ></input>
                    ,{" "}
                    {fromBigInt(lastBumpedAt.timestamp).toLocaleString(
                      DateTime.TIME_SIMPLE
                    )}
                    ]
                  </span>
                </summary>
                <div className="text-xs">
                  <div className="grid grid-cols-4 center text-center">
                    <span className="mx-1">Board creation</span>
                    <input
                      className="col-span-2"
                      id="timetravel"
                      type="range"
                      min={parseInt(timeTravelRange.min.number)}
                      max={parseInt(timeTravelRange.max.number)}
                      onChange={onTimeTravelByBlock}
                      value={currentBlock || lastBlock?.number || ""}
                    />{" "}
                    <span className="mx-1">Now</span>
                  </div>
                  <div className="grid grid-cols-4 center text-center">
                    <span className="mx-1">
                      {fromBigInt(timeTravelRange.min.timestamp).toLocaleString(
                        DateTime.DATE_SHORT
                      )}
                    </span>
                    <span className="col-span-2" />
                    <span className="mx-1">
                      {fromBigInt(timeTravelRange.max.timestamp).toLocaleString(
                        DateTime.DATE_SHORT
                      )}
                    </span>
                  </div>
                </div>
              </details>
              <span className="grid center text-xs">
                {`Selected block #${currentBlock || lastBlock?.number || "?"}`}
                {currentBlock ? (
                  <div className="text-xs">
                    [
                    <button
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                      onClick={onReturnToPresent}
                    >
                      Return to present
                    </button>
                    ]
                  </div>
                ) : (
                  ""
                )}
              </span>
            </span>
          ) : (
            ""
          )}
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
              <div className="text-center">
                <FilterSettings
                  summary={
                    <span>
                      Threads: {threads.length} (Hidden:{" "}
                      {threads.length - filteredThreads.length}
                      ), Posts: {board?.postCount}
                    </span>
                  }
                />
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
                <FilterSettings
                  summary={
                    <span>
                      Threads: {threads.length} (Hidden:{" "}
                      {threads.length - filteredThreads.length}
                      ), Posts: {board?.postCount}
                    </span>
                  }
                />
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
      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
