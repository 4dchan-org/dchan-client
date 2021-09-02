import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan";
import THREAD_GET from "dchan/graphql/queries/thread_get";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Router } from "router";
import ContentHeader from "./ContentHeader";
import PostComponent from "./post/Post";

interface ThreadContentData {
  board: Board;
  threads: Thread[];
}
interface ThreadContentVars {
  board: string;
  n: number;
  block?: number;
}

export default function ThreadContentView({
  thread_n,
  board_id,
  block,
  dateTime,
}: {
  board_id: string;
  thread_n: number;
  block: number;
  dateTime?: DateTime;
}) {
  const variables = {
    block,
    board: board_id,
    n: thread_n,
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

  useEffect(() => {
    refetch();
  }, [block, refetch]);

  return (
    <div>
      <ContentHeader
        board={board}
        thread={thread}
        block={block}
        dateTime={dateTime}
        baseUrl={thread ? Router.thread(thread) : undefined}
      />

      {thread
        ? [thread.op, ...thread.replies].map((post) => (
            <PostComponent post={post} thread={thread} key={post.id} />
          ))
        : ""}
    </div>
  );
}
