import { useQuery } from "@apollo/react-hooks";
import { shortenAddress } from "dchan/services";
import { Board, Post, Thread } from "dchan/subgraph/types";
import { THREAD_GET, THREAD_GET_LAST_BLOCK } from "dchan/subgraph/graphql/queries";
import { useEffect, useMemo } from "react";
import { Router } from "router";
import { usePubSub } from "dchan/hooks";
import { useHistory } from "react-router-dom";
import { useTitle } from "react-use";
import { ContentHeader, Footer, Loading, Anchor, Post as PostComponent } from "dchan/components";
import useTimeTravel from "dchan/hooks/useTimeTravel";
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

export const ThreadPage = ({
  location,
  match: { params },
  pageTheme,
  setPageTheme,
}: {
  location: any,
  match: {params: any},
  pageTheme: string,
  setPageTheme: (theme: string) => void,
}) => {
  let { board_name, board_id, user_id, thread_n } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const history = useHistory();
  const { publish } = usePubSub();
  const { timeTraveledToBlockNumber: block } = useTimeTravel()

  const focus_user_id = params.focus_user_id ? `0x${params.focus_user_id}` : "";
  const focus_post_n = params.focus_post_n || "";

  let variables = {
    board: board_id,
    n: thread_n,
    block,
  };

  const { refetch, data, loading } = useQuery<
    ThreadContentData,
    ThreadContentVars
  >(!!block ? THREAD_GET : THREAD_GET_LAST_BLOCK, {
    variables,
  });

  const post = data?.posts?.[0];
  const thread = data?.threads?.[0];
  const board = data?.board;
  const posts = useMemo(
    () => (thread ? [thread.op, ...thread.replies] : []),
    [thread]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [thread?.id]);

  useEffect(() => {
    const url = !thread && post ? Router.post(post) : undefined;
    url && history.replace(`${url}${block ? `?block=${block}` : ""}`);
  }, [history, thread, block, post]);

  useEffect(() => {
    const filtered =
      !loading && (focus_user_id || focus_post_n)
        ? posts.filter((post) => {
            const idCheck =
              !focus_user_id ||
              post.from.id === focus_user_id ||
              `0x${shortenAddress(post.from.id).replace("-", "")}` ===
                focus_user_id;
            const numCheck = !focus_post_n || post.n === focus_post_n;
            return idCheck && numCheck;
          })
        : [];
    // @NOTE It is possible multiple posts will be found, as per https://dchan.network/#/0x19110a8734d710406836a2b4a7f5f61ddf3743181029b8e2ff3826c6c916f1d5
    if (filtered.length > 0) {
      const post = filtered[0];
      // redirect to standard URL no matter what
      // if the real URL is invalid, it'll get replaced
      // if it's already in use, this will just raise a warning in the console
      history.replace(`${Router.post(post)}${block ? `?block=${block}` : ""}`);
      publish("POST_FOCUS", post);
    } else if (!loading && focus_user_id && focus_post_n) {
      history.replace(`/${focus_user_id}/${focus_post_n}`);
    }
  }, [posts, focus_user_id, focus_post_n, block, loading, publish, history]);

  useEffect(() => {
    // above useEffect will automatically redirect for focusing URLs
    // this will handle the normal case
    if (
      board &&
      thread &&
      (board_name !== board.name || user_id !== thread.op.from.id)
    ) {
      const url = Router.thread(thread);
      url && history.replace(`${url}${block ? `?block=${block}` : ""}`);
    }
  }, [board, thread, board_name, user_id, history, block]);

  useEffect(() => {
    refetch({
      block,
    });
  }, [block, refetch]);

  useEffect(() => {
    if (!board) {
      // persist theme until we know for sure it's different for this board
      // this is to prevent the theme changing back to default for every
      // loading screen, e.g. during time travels or when switching to the
      // board view or between threads
      return;
    }
    setPageTheme(board?.isNsfw ? "nsfw" : "blueboard");
  }, [board, setPageTheme]);

  useTitle(
    board && thread
      ? `/${board.name}/ - ${
          thread.subject || thread.op.comment
        } - dchan.network - [${thread.id}]`
      : `/${board_id}/ - Loading... - dchan.network`
  );

  return (
    <div className="bg-primary min-h-100vh flex flex-col" data-theme={pageTheme}>
      <ContentHeader
        board={board}
        thread={thread}
        summary={
          loading ? <span>...</span> : <span>Posts: {posts.length}</span>
        }
        onRefresh={refetch}
      />

      <div className="flex-grow">
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
                  showNsfw={thread.board?.isNsfw}
                />
              ))}
            </div>

            <div className="flex text-xs pr-1 sticky bottom-0 z-40">
              <span className="flex bg-primary pl-2 rounded ">
                <span className="pr-1">
                  <Anchor to="#board-header" label="Top" />
                </span>
                <span className="pr-1">
                  <div>
                    [
                    <button
                      className="dchan-link"
                      onClick={() => {
                        document
                          .getElementById("board-header")
                          ?.scrollIntoView();
                        document
                          .getElementById("dchan-post-form-textarea")
                          ?.focus();
                      }}
                    >
                      Reply
                    </button>
                    ]
                  </div>
                </span>
              </span>
            </div>
          </div>
        ) : (
          "Post not found."
        )}
      </div>

      <Footer showContentDisclaimer={!!posts && !!thread}></Footer>
    </div>
  );
}