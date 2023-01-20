import useTimeTravel from "dchan/hooks/useTimeTravel";
import { Board, Thread } from "dchan/subgraph/types";
import { Link } from "react-router-dom";
import { Router } from "router";
import { BoardLink, Post } from ".";

export const IndexView = ({
  threads,
  board,
  showBoard = false,
}: {
  threads: Thread[];
  board?: Board;
  showBoard?: boolean;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  return (
    <div>
      {threads
        .filter(thread => !!thread.op)
        .map(thread => (
        <div
          className="border-solid border-black border-b border-secondary"
          key={thread.id}
        >
          <Post
            post={thread.op}
            thread={thread}
            showNsfw={board?.isNsfw}
            key={thread.op.id}
            header={
              <span>
                <span className="p-1 whitespace-nowrap">
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
                    <span className="ml-1 whitespace-nowrap">
                      <BoardLink
                        board={thread.board}
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
              />
            ))}
          </Post>
        </div>
      ))}
    </div>
  );
}
