import { useQuery } from "@apollo/react-hooks";
import ContentHeader from "components/ContentHeader";
import Footer from "components/Footer";
import { Board, Post, Thread } from "dchan";
import THREAD_GET from "graphql/queries/thread_get";
import { DateTime } from "luxon";
import { parse as parseQueryString } from "query-string";
import { useEffect } from "react";
import { Router } from "router";
import PostComponent from "components/post/Post";
import Loading from "components/Loading";
import Anchor from "components/Anchor";
import usePubSub from "hooks/usePubSub";
import { useHistory } from "react-router-dom";
import { useTitle } from "react-use";
import THREAD_GET_LAST_BLOCK from "graphql/queries/thread_get_last_block";

interface ThreadContentData {
  board: Board;
  threads: Thread[];
  posts: Post[];
}
interface ThreadContentVars {
  board: string;
  n: number;
  block?: number;
}

export default function ThreadPage({ location, match: { params } }: any) {
  let { board_id } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const history = useHistory()
  const {publish} = usePubSub()

  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const post_n = params.post_n || ""

  let variables = {
    board: board_id,
    n: params.thread_n,
    block
  };
  
  const { refetch, data, loading } = useQuery<
    ThreadContentData,
    ThreadContentVars
  >(!!block ? THREAD_GET : THREAD_GET_LAST_BLOCK, {
    variables,
    pollInterval: 60_000,
  });

  const post = data?.posts?.[0];
  const thread = data?.threads?.[0];
  const board = data?.board;
  const posts = thread ? [thread.op, ...thread.replies] : [];

  useEffect(() => {
    const url = !thread && post ? Router.post(post) : undefined
    url && history.replace(`${url}${block ? `?block=${block}` : ""}`)
  }, [history, thread, block, post])

  useEffect(() => {
    post_n && !loading && publish("POST_FOCUS", `${post_n}`)
  }, [post_n, loading, publish]);

  useEffect(() => {
    refetch({
      block
    });
  }, [block, refetch]);

  useTitle(board && thread ? `/${board.name}/ - ${thread.subject || thread.op.comment} - dchan.network - [${thread.id}]` : `/${board_id}/ - Loading... - dchan.network`)

  return (
    <div className="bg-primary min-h-100vh">
      <ContentHeader
        board={board}
        thread={thread}
        block={block}
        dateTime={dateTime}
        baseUrl={thread ? Router.thread(thread) : undefined}
        summary={
          loading ? <span>...</span> : <span>Posts: {posts.length}</span>
        }
        onRefresh={refetch}
      />

      <div>
        {loading ? (
          <div className="center grid">
            <Loading />
          </div>
        ) : posts && thread ? (
          <div>
            <div>
              {posts.map((post) => (
                <PostComponent post={post} thread={thread} key={post.id} enableBacklinks={true} />
              ))}
            </div>

            <Anchor to="#board-header" label="Top" />
          </div>
        ) : (
          "Post not found."
        )}
      </div>

      <Footer showContentDisclaimer={!!posts && !!thread}></Footer>
    </div>
  );
}
