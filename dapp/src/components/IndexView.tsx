import { Board, Thread } from "dchan";
import { Link } from "react-router-dom";
import { Router } from "router";
import BoardLink from "./BoardLink";
import Post from "./post/Post";

export default function IndexView({
  threads,
  board,
  block,
  showBoard = false,
}: {
  threads: Thread[];
  board?: Board;
  block?: number;
  showBoard?: boolean;
}) {
  return (
    <div>
      {threads
        .filter(thread => !!thread.op)
        .map(thread => (
        <div
          className="border-solid border-black py-2 border-b border-secondary"
          key={thread.id}
        >
          <Post
            post={thread.op}
            thread={thread}
            showNsfw={board?.isNsfw}
            key={thread.op.id}
            block={block == null ? undefined : `${block}`}
            header={
              <span>
                <span className="p-1">
                  [
                  <Link
                    to={`${Router.thread(thread)}${
                      block ? `?block=${block}` : ""
                    }`}
                    className="dchan-link"
                  >
                    Reply
                  </Link>
                  ]
                  {showBoard && thread.board ? (
                    <span className="mx-2">
                      <BoardLink
                        board={thread.board}
                        block={block == null ? undefined : `${block}`}
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </span>
            }
          >
            <div className="text-left pl-4 text-sm">
              {parseInt(thread.replyCount) > 1 + thread.replies?.length ? (
                <Link
                  to={`${Router.thread(thread)}${
                    block ? `?block=${block}` : ""
                  }`}
                  className="dchan-link"
                >
                  + {parseInt(thread.replyCount) - thread.replies?.length}{" "}
                  replies omitted
                </Link>
              ) : (
                ""
              )}
            </div>
            {[...(thread.replies || [])].reverse().map((post) => (
              <Post
                post={post}
                thread={thread}
                key={post.id}
                showNsfw={board?.isNsfw}
                block={block == null ? undefined : `${block}`}
              />
            ))}
          </Post>
        </div>
      ))}
    </div>
  );
}
