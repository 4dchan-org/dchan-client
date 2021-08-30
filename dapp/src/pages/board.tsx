import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import PostComponent from "components/post/Post";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CONTENT from "dchan/graphql/queries/content";
import { Board, Post, Thread } from "dchan";
import Loading from "components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLink, HashLink as Link } from "react-router-hash-link";
import { useHistory } from "react-router-dom";
import { useThrottleCallback } from "@react-hook/throttle";
import { isLowScore as isLowScoreThread } from "dchan/entities/thread";
import { sortByCreatedAt as sortPostsByCreatedAt } from "dchan/entities/post";
import useSettings from "hooks/useSettings";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { useTitle } from "react-use";
import SearchWidget from "components/SearchWidget";
import { Router } from "router";
import FilterSettings from "components/FilterSettings";
import TimeTravelWidget from "components/TimeTravelWidget";
import { RefreshWidget } from "components/RefreshWidget";
import { DateTime } from "luxon";

interface ContentData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
  postSearch: Post[];
  selectedThread: Thread[];
}
interface ContentVars {
  board: string;
  thread_n: string;
  block?: number;
  limit: number;
  search: string;
}

export default function CatalogPage({ location, match: { params } }: any) {
  let { board: boardId } = params;
  boardId = `0x${boardId}`;

  const query = parseQueryString(location.search);
  const history = useHistory();
  const s = query.s || query.search;
  const [search, setSearch] = useState<string>(isString(s) ? s : "");

  const lastBlock = useLastBlock();
  const dateTime = query.date ? DateTime.fromISO(query.date as string) : undefined
  
  const block = parseInt(`${query.block || lastBlock?.number || ""}`)
  const variables = {
    block,
    board: boardId,
    thread_n: params.thread_n || "0",
    limit: 25,
    search: search.length > 1 ? `${search}:*` : "",
  };

  const { refetch, loading, data } = useQuery<ContentData, ContentVars>(
    CONTENT,
    {
      variables,
      pollInterval: 60_000
    }
  );

  const thread = data?.selectedThread[0];
  const postSearch = data?.postSearch;
  const board = data?.board;
  const threads = useMemo(
    () => [...(data?.pinned || []), ...(data?.threads || [])],
    [data]
  );

  const sortedPostSearch = useMemo(() => {
    return sortPostsByCreatedAt(
      postSearch
        ? postSearch.filter((post) => {
            return post && post.thread && post.board;
          })
        : []
    );
  }, [postSearch]);

  const refresh = useCallback(async () => {
    try {
      await refetch({
        board: boardId,
      });
    } catch (e) {
      console.error({ refreshError: e });
    }
  }, [boardId, refetch]);

  const [focused, setFocused] = useState<string>("");

  const onFocus = useCallback(
    (focusId: string) => {
      if (focused === focusId && !!board && thread) {
        const url = Router.thread(thread);
        url && history.push(url);
      } else {
        setFocused(focusId);
      }
    },
    [thread, board, focused, history, setFocused]
  );

  const [baseUrl, setBaseUrl] = useState<string>();
  useEffect(() => {
    const newBaseUrl = thread
      ? Router.thread(thread)
      : board
      ? Router.board(board)
      : undefined;
    !!newBaseUrl && baseUrl !== newBaseUrl && setBaseUrl(newBaseUrl);
  }, [thread, board, baseUrl, setBaseUrl]);

  const [settings] = useSettings();

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

  const throttledRefresh = useThrottleCallback(refresh, 1, true);

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
          {!block ? <RefreshWidget onRefresh={throttledRefresh} /> : ""}
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
          <TimeTravelWidget
            baseUrl={baseUrl || ""}
            startBlock={thread ? thread.createdAtBlock : board ? board.createdAtBlock : undefined}
            dateTime={dateTime}
            block={block}
            startRangeLabel={
              "Board creation"
            }
          />
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
          ""
        )}
      </div>

      <div id="bottom" />
      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
