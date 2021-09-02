import { useQuery } from "@apollo/react-hooks";
import ContentHeader from "components/ContentHeader";
import Footer from "components/Footer";
import { Board, Thread } from "dchan";
import THREAD_GET from "dchan/graphql/queries/thread_get";
import { DateTime } from "luxon";
import { parse as parseQueryString } from "query-string";
import { useEffect } from "react";
import { Router } from "router";
import PostComponent from "components/post/Post";
import useLastBlock from "hooks/useLastBlock";

interface ThreadContentData {
  board: Board;
  threads: Thread[];
}
interface ThreadContentVars {
  board: string;
  n: number;
  block?: number;
}

export default function ThreadPage({ location, match: { params } }: any) {
  let { board_id } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const lastBlock = useLastBlock();
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block || lastBlock?.number || "0"}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const variables = {
    block,
    board: board_id,
    n: params.thread_n,
  };

  const { refetch, data } = useQuery<ThreadContentData, ThreadContentVars>(
    THREAD_GET,
    {
      variables,
      pollInterval: 60_000,
    }
  );

  const thread = data?.threads?.[0];
  const board = data?.board;

  useEffect(() => {
    refetch();
  }, [block, refetch]);

  console.log({ thread, block });

  return (
    <div className="bg-primary min-h-100vh">
      <ContentHeader
        board={board}
        thread={thread}
        block={block}
        dateTime={dateTime}
        baseUrl={thread ? Router.thread(thread) : undefined}
      />

      <div>
        {thread
          ? [thread.op, ...thread.replies].map((post) => (
              <PostComponent post={post} thread={thread} key={post.id} />
            ))
          : ""}
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
