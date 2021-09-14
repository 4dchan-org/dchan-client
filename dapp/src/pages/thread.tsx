import { useQuery } from "@apollo/react-hooks";
import ContentHeader from "components/ContentHeader";
import Footer from "components/Footer";
import { Board, Post, Thread } from "dchan";
import THREAD_GET from "graphql/queries/thread_get";
import { DateTime } from "luxon";
import { parse as parseQueryString } from "query-string";
import { useEffect, useMemo } from "react";
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

  const history = useHistory();
  const { publish } = usePubSub();

  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const focus_user_id = params.focus_user_id ? `0x${params.focus_user_id}` : "";
  const focus_post_n = params.focus_post_n || "";

  let variables = {
    board: board_id,
    n: params.thread_n,
    block,
  };

  const { refetch, data, loading } = useQuery<
    ThreadContentData,
    ThreadContentVars
  >(!!block ? THREAD_GET : THREAD_GET_LAST_BLOCK, {
    variables
  });

  const post = data?.posts?.[0];
  const thread = data?.threads?.[0];
  const board = data?.board;
  const posts = useMemo(
    () => (thread ? [thread.op, ...thread.replies] : []),
    [thread]
  );

  useEffect(() => {
    const url = !thread && post ? Router.post(post) : undefined;
    url && history.replace(`${url}${block ? `?block=${block}` : ""}`);
  }, [history, thread, block, post]);

  useEffect(() => {
    const filtered = !loading && (focus_user_id || focus_post_n)
      ? posts.filter(
          (post) => (!focus_user_id || post.from.id === focus_user_id) && (!focus_post_n || post.n === focus_post_n)
        )
      : [];
    
    if (filtered.length > 0) {
      publish("POST_FOCUS", filtered)
    } else if (!loading && focus_user_id && focus_post_n) {
      history.replace(`/${focus_user_id}/${focus_post_n}`);
    }
  }, [posts, focus_user_id, focus_post_n, loading, publish, history]);

  useEffect(() => {
    refetch({
      block,
    });
  }, [block, refetch]);

  useTitle(
    board && thread
      ? `/${board.name}/ - ${
          thread.subject || thread.op.comment
        } - dchan.network - [${thread.id}]`
      : `/${board_id}/ - Loading... - dchan.network`
  );

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
        {loading && !data ? (
          <div className="center grid">
            <Loading />
          </div>
        ) : posts && thread ? (
          <div>
            <div>
              {posts.map((post) => (
                <PostComponent
                  post={post}
                  thread={thread}
                  key={post.id}
                  enableBacklinks={true}
                />
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
