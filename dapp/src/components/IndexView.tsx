import { Thread } from "dchan";
import { Link } from "react-router-dom";
import { Router } from "router";
import BoardLink from "./BoardLink";
import Post from "./post/Post";

export default function IndexView({
    threads,
    block,
    showBoard = false
}: {
    threads: Thread[];
    block?: number,
    showBoard?: boolean
}) {
    return (
        <div>
            {threads.map((thread) => {
                return (
                    <div
                        className="border-solid border-black py-2 border-b border-secondary"
                        key={thread.id}
                    >
                        <Post
                            post={thread.op}
                            thread={thread}
                            key={thread.op.id}
                            header={
                                <span>
                                    <span className="p-1">
                                        [
                                        <Link
                                            to={`${Router.thread(thread)}${block
                                                    ? `?block=${block}`
                                                    : ""
                                                }`}
                                            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                                        >
                                            Reply
                                        </Link>
                                        ]
                                        {showBoard && thread.board ? (
                                            <span>
                                                <BoardLink board={thread.board} />
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </span>
                            }
                        >
                            <div className="text-left pl-8">
                                {parseInt(thread.replyCount) >
                                    1 + thread.replies.length ? (
                                    <Link
                                        to={`${Router.thread(thread)}${block
                                                ? `?block=${block}`
                                                : ""
                                            }`}
                                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                                    >
                                        +{" "}
                                        {parseInt(thread.replyCount) -
                                            thread.replies.length}{" "}
                                        replies omitted
                                    </Link>
                                ) : (
                                    ""
                                )}
                            </div>
                            {[...thread.replies].reverse().map((post) => (
                                <Post
                                    post={post}
                                    thread={thread}
                                    key={post.id}
                                />
                            ))}
                        </Post>
                    </div>
                );
            })}
        </div>
    );
}