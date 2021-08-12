import sanitizeHtml from "sanitize-html";
import { backgroundColorAddress, shortenAddress, Thread, User } from "dchan";
import Footer from "components/Footer";
import BoardHeader from "components/board/header";
import FormPost from "components/form/post";
import IPFSThumbnail from "components/IPFSThumbnail";
import { useQuery } from "@apollo/react-hooks";
import THREAD_GET from "dchan/graphql/queries/threads/get";
import { DateTime } from "luxon";
import Loading from "components/Loading";
import useWeb3 from "hooks/useWeb3";
import React, { useState } from "react";
import Status, { SetStatus } from "components/Status";
import UserData from "hooks/userData";
import Menu from "components/Menu";
import {
  banPost,
  lockThread,
  pinThread,
  removePost,
  reportPost,
  unlockThread,
  unpinThread,
} from "dchan/operations";
import Error from "components/Error";
import _ from "lodash";
import PostBody from "components/post/PostBody";

interface ThreadData {
  thread?: Thread;
}
interface ThreadVars {
  threadId: string;
}

interface UserData {
  user?: User;
}
interface UserVars {
  userId: string;
}

export default function ThreadPage({
  match: {
    params: { threadId },
  },
}: any) {
  const useWeb3Result = useWeb3();
  const { accounts } = useWeb3Result;
  const { loading, data } = useQuery<ThreadData, ThreadVars>(THREAD_GET, {
    variables: { threadId: `0x${threadId}` },
    pollInterval: 10000,
  });
  const thread = data?.thread;

  const userData = UserData(accounts);
  const isJanny = userData?.user?.isJanny || false;

  const replyTo = (id: string) => {
    console.log({ id });
  };

  return loading ? (
    <Loading></Loading>
  ) : !thread ? (
    <Error subject={"Thread not found"} body={"¯\\_(ツ)_/¯"} />
  ) : (
    <div className="min-h-100vh" dchan-board={thread?.board.name}>
      <BoardHeader board={thread?.board} isJanny={isJanny}></BoardHeader>
      <FormPost thread={thread} useWeb3={useWeb3Result}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="font-size-090rem mx-2 sm:mx-4">
        {[thread.op, ...thread.replies].map((post) => {
          let {
            id,
            from: { id: address },
            n,
            name,
            image,
            bans,
            comment,
            createdAt: createdAtUnix,
          } = post;

          const ipfsUrl = !!image
            ? `https://ipfs.io/ipfs/${image.ipfsHash}`
            : "";
          const addressShort = shortenAddress(address);
          const backgroundColor = backgroundColorAddress(address);
          const createdAt = DateTime.fromMillis(parseInt(createdAtUnix) * 1000);
          const isOp = id === thread?.id;
          const isOwner = accounts.length > 0 && accounts[0] === address;

          const isPinned = thread?.isPinned;
          const isLocked = thread?.isLocked;

          const canPin = isOp && isJanny;
          const canRemove = isOwner || isJanny;
          const canBan = isJanny;
          const canLock = isOp && (isOwner || isJanny);

          name = !name || "" === name ? "Anonymous" : name;

          const PostHeader = () => {
            const [status, setStatus] = useState<string | object>();

            return (
              <span>
                <span className="px-0.5 whitespace-nowrap">
                  <span className="text-accent font-bold">{name}</span>
                </span>
                <span className="px-0.5">
                  (
                  <a
                    style={{ backgroundColor }}
                    className="font-family-tahoma text-readable-anywhere px-0.5 mx-0.5 rounded whitespace-nowrap"
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                  >
                    <abbr style={{ textDecoration: "none" }} title={address}>
                      {addressShort}
                    </abbr>
                  </a>
                  )
                </span>
                <span className="px-0.5 whitespace-nowrap text-xs">
                  {createdAt.toLocaleString(DateTime.DATETIME_SHORT)} (
                  {createdAt.toRelative()})
                </span>
                <span className="px-0.5 on-parent-target-font-bold font-family-tahoma whitespace-nowrap">
                  <a href={`#${id}`} title="Link to this post">
                    No.
                  </a>
                  <button
                    title="Reply to this post"
                    onClick={() => replyTo(id)}
                  >
                    {n}
                  </button>
                </span>
                <span className="dchan-backlinks"></span>
                <span>
                  {isOp && isPinned ? (
                    <span title="Thread pinned. This might be important.">
                      📌
                    </span>
                  ) : (
                    <span></span>
                  )}
                  {isOp && isLocked ? (
                    <span title="Thread locked. You cannot reply anymore.">
                      🔒
                    </span>
                  ) : (
                    <span></span>
                  )}
                </span>
                <Menu>
                  {canLock ? (
                    <div>
                      {thread.isLocked ? (
                        <span>
                          <input
                            name="lock"
                            type="hidden"
                            value="false"
                          ></input>
                          <button
                            onClick={() =>
                              unlockThread(id, accounts, setStatus)
                            }
                          >
                            🔓 Unlock
                          </button>
                        </span>
                      ) : (
                        <span>
                          <input name="lock" type="hidden" value="true"></input>
                          <button
                            onClick={() => lockThread(id, accounts, setStatus)}
                          >
                            🔒 Lock
                          </button>
                        </span>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {canPin ? (
                    <div>
                      {thread.isPinned ? (
                        <span>
                          <input
                            name="sticky"
                            type="hidden"
                            value="false"
                          ></input>
                          <button
                            onClick={() => unpinThread(id, accounts, setStatus)}
                          >
                            📌 Unpin
                          </button>
                        </span>
                      ) : (
                        <span>
                          <input
                            name="sticky"
                            type="hidden"
                            value="true"
                          ></input>
                          <button
                            onClick={() => pinThread(id, accounts, setStatus)}
                          >
                            📌 Pin
                          </button>
                        </span>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {canRemove ? (
                    <div>
                      <button
                        onClick={() => removePost(id, accounts, setStatus)}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  {canBan ? (
                    <div>
                      <button onClick={() => banPost(id, accounts, setStatus)}>
                        🔫 Ban
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <button onClick={() => reportPost(id, accounts, setStatus)}>
                      ⚠️ Report
                    </button>
                  </div>
                </Menu>
                <Status status={status}></Status>
              </span>
            );
          };

          return (
            <details className="dchan-post-expand" open={true} key={id}>
              <summary
                className="text-left pl-2 opacity-50 z-10"
                title="Hide/Show"
              >
                <PostHeader></PostHeader>
              </summary>
              <article
                id={id}
                className="dchan-post text-left w-full"
                dchan-post-from-address={address}
              >
                <div
                  className={`${
                    !isOp ? "bg-secondary" : ""
                  } w-full sm:w-auto pb-2 mb-2 px-4 inline-block on-parent-target-highlight border-bottom-invisible relative max-w-screen-xl`}
                >
                  <div className="flex flex-wrap center sm:block pl-2">
                    <PostHeader></PostHeader>
                  </div>
                  {!!image ? (
                    <div className="text-center sm:text-left">
                      <span>
                        File:{" "}
                        <span className="text-xs">
                          <a
                            className="text-blue-600 max-w-64"
                            href={ipfsUrl}
                            title={image.name}
                          >
                            {_.truncate(image.name, {
                              length: 32,
                              omission: "...",
                            })}
                          </a>
                          {/* <a className="text-blue-600" href={ipfsUrl} download={`ipfs_${image.id}.${image.name}`}>📥</a> */}
                          <span>, {Math.trunc(image.byteSize * 0.001)}kb</span>
                          {/* <span>{image.resolution.height}x{image.resolution.width}</span> */}
                        </span>
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="py-1">
                    <div className="h-full max-w-max">
                      {!!image ? (
                        <div className="px-2 sm:float-left grid center">
                          <IPFSThumbnail
                            hash={image.ipfsHash}
                            isSpoiler={image.isSpoiler}
                            isNsfw={image.isNsfw}
                          ></IPFSThumbnail>
                        </div>
                      ) : (
                        ""
                      )}

                      {isOp ? (
                        <span className="font-semibold">{thread.subject}</span>
                      ) : (
                        ""
                      )}

                      <PostBody>{comment}</PostBody>

                      {bans.length > 0 ? (
                        <div className="text-xl font-bold text-contrast whitespace-nowrap">
                          ( USER WAS BANNED FOR THIS POST )
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </details>
          );
        })}
        <div>
          <a href="#board-header" className="inline bg-secondary rounded-full">
            ⤴️
          </a>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
