import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import CATALOG_TIMETRAVEL from "dchan/graphql/queries/catalog_tt";
import { Board, dateTimeFromBigInt, getLastCreatedAtBlock, isLowScore, Thread } from "dchan";
import Loading from "components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLink, HashLink as Link } from "react-router-hash-link";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";
import useInterval from "@use-it/interval";
import { useThrottleCallback } from "@react-hook/throttle";

interface CatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface CatalogVars {
  boardId: string;
  currentBlock?: number;
  limit: number;
}

export default function CatalogPage({
  match: {
    params: { boardId: boardIdParam },
  },
}: any) {
  const boardId = `0x${boardIdParam}`;
  const [showLowScore, setShowLowScore] = useState<boolean>(false); // @TODO config
  const [isTimeTravelPanelOpen, setTimeTravelPanelOpen] = useState<boolean>(false); // @TODO config
  const [search, setSearch] = useState<string>("");
  const [currentBlock, setCurrentBlock] = useState<number | undefined>(
    undefined
  );
  const [timeTravelRange, setTimeTravelRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  const { refetch, loading, data } = useQuery<CatalogData, CatalogVars>(
    !currentBlock ? CATALOG : CATALOG_TIMETRAVEL,
    {
      variables: !currentBlock
        ? { boardId, limit: 25 }
        : { boardId, currentBlock, limit: 25 },
      pollInterval: 60_000,
    }
  );

  const board = data?.board;
  const threads = useMemo(
    () => [...(data?.pinned || []), ...(data?.threads || [])],
    [data]
  );

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );
  const [lastBumpedAtShort, setLastBumpedAtShort] = useState<string>("")
  useEffect(() => {
    board && setLastBumpedAtShort(dateTimeFromBigInt(board.lastBumpedAt).toLocaleString(DateTime.DATETIME_SHORT))
  }, [board, setLastBumpedAtShort])

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

  const onRefresh = useThrottleCallback(refresh, 1, true)
  const onSearchChange = (e: any) => setSearch(e.target.value);

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
    setTimeTravelPanelOpen(!isTimeTravelPanelOpen)
  }, [isTimeTravelPanelOpen, setTimeTravelPanelOpen])

  // Time travel
  const onTimeTravel = useThrottleCallback(useCallback(
    (e) => {
      setCurrentBlock(parseInt(e.target.value));
    },
    [setCurrentBlock]
  ), 1, true);

  useEffect(() => {
    if (board?.createdAtBlock && currentBlock === undefined) {
      const lastCreatedAtBlock = parseInt(
        getLastCreatedAtBlock(threads) || `${board?.createdAtBlock}`
      );
      // setCurrentBlock(lastCreatedAtBlock)
      setTimeTravelRange({
        min: board?.createdAtBlock,
        max: lastCreatedAtBlock,
      });
    }
  }, [board, threads, currentBlock, setCurrentBlock, setTimeTravelRange]);

  // Last refreshed 
  // This is a crock of bullshit
  const refreshLastRefreshedAtRelative = useCallback(() => {
    setLastRefreshedAtRelative(
      lastRefreshedAt.toRelative() || ""
    );
  }, [lastRefreshedAt, setLastRefreshedAtRelative])

  useEffect(() => {
    refreshLastRefreshedAtRelative()
  }, [lastRefreshedAt, refreshLastRefreshedAtRelative])

  useInterval(() => {
    refreshLastRefreshedAtRelative()
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
          {!currentBlock ?
            <span className="mx-1">
              [
            <button
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                onClick={onRefresh}
              >
                {lastRefreshedRelative}
              </button>
            ]
          </span> : ""}
        </div>
        <div className="flex-grow">
        </div>
        <div className="mx-2 sm:text-center sm:text-right sm:flex sm:items-center sm:justify-end">
          {timeTravelRange.min && timeTravelRange.max ? (
            <details className="mx-1 sm:text-right" open={isTimeTravelPanelOpen}>
              <summary>
                [
                <button
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  onClick={toggleTimeTravelPanel}
                >Time Travel</button>
                ]
              </summary>
              <div className="text-xs">
                <div className="flex center">
                  <span className="mx-1">Board creation</span>
                  <input
                    id="timetravel"
                    type="range"
                    min={timeTravelRange.min}
                    max={timeTravelRange.max}
                    onChange={onTimeTravel}
                    value={currentBlock || getLastCreatedAtBlock(threads)}
                  />{" "}
                  <span className="mx-1">Now</span>
                </div>
                {currentBlock ? (
                  <div>
                    <div>Block n.{currentBlock}</div>
                    <div>
                      [
                      <button
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                        onClick={() => setCurrentBlock(undefined)}
                      >
                        Return to present
                      </button>
                      ]
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </details>
          ) : (
            ""
          )}
          {lastBumpedAtShort ?
            <span className="mx-1 text-xs">
              [
            {lastBumpedAtShort}
            ]
          </span> : ""}
          <div className="mx-1 text-center">
            <div>
              <label htmlFor="search">Search: </label>
            </div>
            <div>
              <input
                id="search"
                className="text-center w-32"
                type="text"
                placeholder="..."
                onChange={onSearchChange}
              ></input>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="min-h-screen">
        {loading ? (
          <Loading className="p-4"></Loading>
        ) : board && threads ? (
          threads.length === 0 ? (
            <div className="center grid">{`No threads.`}</div>
          ) : (
            <div>
              <div className="text-center">
                <details className="pb-1">
                  <summary>
                    Threads: {threads.length} (Hidden:{" "}
                    {threads.filter((t) => isLowScore(t)).length}), Messages:{" "}
                    {board?.postCount}
                  </summary>
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
                </details>

              </div>
              <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
                {threads
                  .filter((thread: Thread) => {
                    return (
                      (!search ||
                        thread.subject
                          .toLocaleLowerCase()
                          .indexOf(search.toLocaleLowerCase()) !== -1 ||
                        thread.op.comment
                          .toLocaleLowerCase()
                          .indexOf(search.toLocaleLowerCase()) !== -1) &&
                      (showLowScore || !isLowScore(thread))
                    );
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
