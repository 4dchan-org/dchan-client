import { Board, sendMessage, shortenAddress, Thread, User } from "dchan";
import Footer from "components/Footer";
import BoardHeader from "components/board/header";
import FormPost from "components/form/post";
import Thumbnail from "components/Thumbnail";
import { useQuery } from "@apollo/react-hooks";
import THREAD_GET from "dchan/graphql/queries/threads/get";
import { DateTime } from "luxon";
import Loading from "components/Loading";
import useWeb3 from "hooks/useWeb3";
import USER_GET from "dchan/graphql/queries/user/get";
import { useState } from "react";
import Status, { SetStatus } from "components/Status";
import Menu from "components/Menu";
import UserData from "hooks/userData";

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

async function removePost(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Removing..."
    });

    await sendMessage("post:remove", { id }, accounts[0]);

    setStatus({
      success: "Removed"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function lockThread(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Locking..."
    });

    await sendMessage("thread:lock", { id }, accounts[0]);

    setStatus({
      success: "Locked"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function unlockThread(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Unlocking..."
    });

    await sendMessage("thread:unlock", { id }, accounts[0]);

    setStatus({
      success: "Unlocked"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function pinThread(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Pinning..."
    });

    await sendMessage("thread:pin", { id }, accounts[0]);

    setStatus({
      success: "Pinned"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function unpinThread(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Unpinning..."
    });

    await sendMessage("thread:unpin", { id }, accounts[0]);

    setStatus({
      success: "Unpinned"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function reportPost(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Reporting..."
    });

    await sendMessage("post:report", { id }, accounts[0]);

    setStatus({
      success: "Reported"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

export default function ThreadPage({
  match: {
    params: { threadId },
  },
}: any) {
  const [status, setStatus] = useState<string | object>();
  const useWeb3Result = useWeb3();
  const { accounts } = useWeb3Result;
  const { data } = useQuery<ThreadData, ThreadVars>(THREAD_GET, {
    variables: { threadId },
    pollInterval: 10000,
  });
  const thread = data?.thread;

  const userData = UserData(accounts)
  const isJanny = userData?.user?.isJanny || false;

  return !thread ? (
    <Loading></Loading>
  ) : (
    <div className="min-h-100vh" dchan-board={thread?.board.name}>
      <BoardHeader board={thread?.board} isJanny={isJanny}></BoardHeader>
      <FormPost thread={thread} useWeb3={useWeb3Result}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="font-size-090rem mx-2 sm:mx-4">
        {[thread.op, ...thread.replies].map(
          ({
            id,
            from: { name, id: address },
            n,
            image,
            subject,
            comment,
            createdAt: createdAtUnix,
          }) => {
            // const createdAtDt = new Date(createdAt).toISOString()
            const ipfsUrl = !!image
              ? `https://ipfs.io/ipfs/${image.ipfsHash}`
              : "";
            const addressShort = shortenAddress(address);
            const backgroundColor = `#${addressShort.replace("-", "")}`;
            const createdAt = DateTime.fromMillis(
              parseInt(createdAtUnix) * 1000
            );
            const isOp = id === thread?.id;
            const isOwner = accounts.length > 0 && accounts[0] === address;
            const canPin = isOp && isJanny;
            const canRemove = isOwner || isJanny;
            const canLock = isOp && (isOwner || isJanny);

            name = !name || "" === name ? "Anonymous" : "";

            return (
              <details className="dchan-post-expand" open={true} key={id}>
                <summary className="text-left pl-2 opacity-75 z-10" title="Hide/Show">
                  <span className="font-semibold">{subject}</span>
                  <span className="px-0.5 whitespace-nowrap">
                    <span className="text-accent font-bold">{name}</span>
                  </span>
                  <span className="px-0.5">
                    (
                    <a
                      style={{ backgroundColor }}
                      className="font-family-tahoma text-readable-anywhere px-0.5 mx-0.5 rounded"
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
                    <button title="Reply to this post">{n}</button>
                  </span>
                  <span>
                    {thread?.isPinned ? (
                      <span title="Thread pinned. This might be important.">
                        📌
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {isOp && thread?.isLocked ? (
                      <span title="Thread locked. You cannot reply anymore.">
                        🔒
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </span>
                </summary>
                <article
                  id={id}
                  className="dchan-post text-left w-full"
                  dchan-post-from-address={address}
                >
                  <div
                    className={`${
                      !isOp ? "bg-secondary" : ""
                    } w-full sm:w-auto pb-2 mb-2 px-4 inline-block on-parent-target-highlight border-bottom-invisible relative`}
                  >
                    <div className="flex flex-wrap center sm:block">
                      <span className="font-semibold">{subject}</span>
                      <span className="px-0.5 whitespace-nowrap">
                        <span className="text-accent font-bold pl-2">
                          {name}
                        </span>
                      </span>
                      <span className="px-0.5">
                        (
                        <a
                          style={{ backgroundColor }}
                          className="font-family-tahoma text-readable-anywhere px-0.5 mx-0.5 rounded"
                          href={`https://etherscan.io/address/${address}`}
                          target="_blank"
                        >
                          <abbr
                            style={{ textDecoration: "none" }}
                            title={address}
                          >
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
                        <button title="Reply to this post">{n}</button>
                      </span>
                      <span className="dchan-backlinks"></span>
                      <span>
                        {thread?.isPinned ? (
                          <span title="Thread pinned. This might be important.">
                            📌
                          </span>
                        ) : (
                          <span></span>
                        )}
                        {isOp && thread?.isLocked ? (
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
                                <input
                                  name="lock"
                                  type="hidden"
                                  value="true"
                                ></input>
                                <button
                                  onClick={() =>
                                    lockThread(id, accounts, setStatus)
                                  }
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
                                  onClick={() =>
                                    unpinThread(id, accounts, setStatus)
                                  }
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
                                  onClick={() =>
                                    pinThread(id, accounts, setStatus)
                                  }
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
                              onClick={() =>
                                removePost(id, accounts, setStatus)
                              }
                            >
                              ❌ Remove
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          <button
                            onClick={() => reportPost(id, accounts, setStatus)}
                          >
                            ⚠️ Report
                          </button>
                        </div>
                      </Menu>
                    </div>
                    {!!image ? (
                      <div className="text-center sm:text-left">
                        <span>
                          File:{" "}
                          <span className="text-xs">
                            <a className="text-blue-600" href={ipfsUrl}>
                              {image.name}
                            </a>
                            {/* <a className="text-blue-600" href={ipfsUrl} download={`ipfs_${image.id}.${image.name}`}>📥</a> */}
                            <span>
                              , {Math.trunc(image.byteSize * 0.001)}kb
                            </span>
                            {/* <span>{image.resolution.height}x{image.resolution.width}</span> */}
                          </span>
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="py-1">
                      <div className="h-full">
                        {!!image ? (
                          <div className="px-2 sm:float-left grid center">
                            <Thumbnail
                              src={ipfsUrl}
                              isSpoiler={image.isSpoiler || image.isNsfw}
                            ></Thumbnail>
                          </div>
                        ) : (
                          ""
                        )}

                        <blockquote className="text-center sm:text-left">
                          {comment}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </article>
              </details>
            );
          }
        )}
        <div>
          <a href="#board-header" className="inline bg-secondary rounded-full">
            ⤴️
          </a>
        </div>
      </div>

      <Footer></Footer>

      <Status className="absolute bottom-0 left-0 p-4" status={status}></Status>
    </div>
  );
}
