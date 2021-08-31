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
import {
  isLowScore as isLowScorePost,
  sortByCreatedAt as sortPostsByCreatedAt,
} from "dchan/entities/post";
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
import { truncate } from "lodash";
import IdLabel from "components/IdLabel";

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

export default function ContentPage({ location, match: { params } }: any) {
  let { board: boardId } = params;
  boardId = `0x${boardId}`;

  const query = parseQueryString(location.search);
  const history = useHistory();
  const s = query.s || query.search;
  const search = isString(s) ? s : ""

  const lastBlock = useLastBlock();
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const block = parseInt(`${query.block || lastBlock?.number || ""}`);
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
      pollInterval: 60_000,
    }
  );

  const postSearch = data?.postSearch;
  const board = data?.board;
  const thread = data?.selectedThread[0];
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

  const [focused, setFocused] = useState<Thread | undefined>(undefined);

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

  const [baseUrl, setBaseUrl] = useState<string>();
  useEffect(() => {
    const newBaseUrl = thread
      ? Router.thread(thread)
      : board
      ? Router.board(board)
      : Router.posts();
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
            onFocus={(e) => onFocus(thread)}
            isFocused={true === (focused && focused.n === thread.n)}
            thread={thread}
            key={thread.id}
          ></CatalogThread>
        )),
    [threads, settings, focused, onFocus]
  );

  const throttledRefresh = useThrottleCallback(refresh, 1, true);

  useTitle(
    `/${board?.name}/ - ${board?.title} ${
      thread
        ? `- ${truncate(
            [thread.subject, thread.op.comment].filter((t) => !!t).join(" - "),
            { length: 24 }
          )}`
        : ""
    }`
  );

  return (
    <div
      className="bg-primary min-h-100vh"
      dchan-board={board?.name}
      data-theme={board?.isNsfw ? "nsfw" : "blueboard"}
    >
      <BoardHeader board={board}></BoardHeader>

      <FormPost thread={thread} board={board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="absolute top-0 right-0">
        {baseUrl ? (
          <SearchWidget
            baseUrl={Router.posts()}
            search={search}
          />
        ) : (
          ""
        )}
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
          {!query.block ? <RefreshWidget onRefresh={throttledRefresh} /> : ""}
        </div>
        <div className="flex-grow"></div>
        <div className="mx-2 sm:text-center sm:text-right sm:flex sm:items-center sm:justify-end">
          <TimeTravelWidget
            baseUrl={baseUrl || ""}
            startBlock={
              thread
                ? thread.createdAtBlock
                : board
                ? board.createdAtBlock
                : undefined
            }
            dateTime={dateTime}
            block={block}
            startRangeLabel={
              params.thread_n ? "Thread creation" : "Board creation"
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
                      Found: {postSearch.length} posts (Hidden:{" "}
                      {
                        postSearch.filter((p) =>
                          isLowScorePost(p, settings?.content?.score_threshold)
                        ).length
                      }
                      )
                    </span>
                  }
                />
              </div>
              <div>
                {sortedPostSearch?.map((post) => (
                  <div className="p-2 flex flex-wrap">
                    <PostComponent
                      key={post.id}
                      post={post}
                      header={
                        <span>
                          <span className="p-1">[
                            <span className="p-1">
                              <Link
                                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                                to={`/${post.board?.name}/${post.board?.id}`}
                              >
                                /{post.board?.name}/
                                <IdLabel
                                  id={post.board?.id || "0x000000"}
                                ></IdLabel>
                              </Link>
                            </span>]
                          </span>
                          <span className="p-1">
                            [
                            <Link
                              to={`/${post.id}`}
                              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                            >
                              View
                            </Link>
                            ]
                          </span>
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
        ) : thread ? (
          [thread.op, ...thread.replies].map((post) => (
            <PostComponent post={post} thread={thread} key={post.id} />
          ))
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
