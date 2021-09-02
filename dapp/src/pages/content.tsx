import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import { useQuery } from "@apollo/react-hooks";
import CONTENT from "dchan/graphql/queries/content";
import { Board, Post, Thread } from "dchan";
import Loading from "components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useThrottleCallback } from "@react-hook/throttle";
import { sortByCreatedAt as sortPostsByCreatedAt } from "dchan/entities/post";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { useTitle } from "react-use";
import SearchWidget from "components/SearchWidget";
import { Router } from "router";
import TimeTravelWidget from "components/TimeTravelWidget";
import { RefreshWidget } from "components/RefreshWidget";
import { DateTime } from "luxon";
import { truncate } from "lodash";
import ThreadContentView from "components/ThreadContentView";
import SearchResultsView from "components/SearchResultsView";
import BoardCatalogView from "components/BoardCatalogView";
import usePubSub from "hooks/usePubSub";

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
  boardId = boardId ? `0x${boardId}` : undefined;

  const query = parseQueryString(location.search);
  const s = query.s || query.search;
  const search = isString(s) ? s : "";

  const lastBlock = useLastBlock();
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const threadN = params.thread_n;
  const postN = params.post_n;
  const block = parseInt(`${query.block || lastBlock?.number || ""}`);
  const {publish} = usePubSub()
  useEffect(() => {
    postN && publish("POST_FOCUS", `${postN}`)
  }, [postN, publish]);

  const variables = {
    block,
    board: boardId,
    thread_n: threadN,
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
        block,
        board: boardId,
        thread_n: threadN,
      });
    } catch (e) {
      console.error({ refreshError: e });
    }
  }, [block, threadN, boardId, refetch]);

  useEffect(() => {
    refresh();
  }, [block, refresh]);

  const [baseUrl, setBaseUrl] = useState<string>();
  useEffect(() => {
    const newBaseUrl = params.thread_n
      ? (thread ? Router.thread(thread) : undefined)
      : params.board
      ? (board ? Router.board(board) : undefined)
      : Router.posts();
    !!newBaseUrl && baseUrl !== newBaseUrl && setBaseUrl(newBaseUrl);
  }, [params, thread, board, baseUrl, setBaseUrl]);

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

      <div className="absolute top-4 sm:top-0 right-4">
        {baseUrl ? (
          <SearchWidget baseUrl={Router.posts()} search={search} />
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
          <SearchResultsView results={sortedPostSearch} />
        ) : thread ? (
          <ThreadContentView thread={thread} />
        ) : (
          <BoardCatalogView board={board} threads={threads} />
        )}
      </div>

      <div id="bottom" />
      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
