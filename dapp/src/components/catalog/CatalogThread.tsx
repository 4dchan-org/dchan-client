import { Thread } from "dchan";
import IPFSImage from "components/IPFSImage";
import PostBody from "components/post/PostBody";
import { isLowScore as isLowScoreThread } from "dchan/entities/thread";
import useSettings from "hooks/useSettings";
import { Link, useHistory } from "react-router-dom";
import { Router } from "router";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import usePubSub from "hooks/usePubSub";
import BoardLink from "components/BoardLink";

const CatalogThread = ({
  thread,
  block,
  showBoard = false,
}: {
  thread: Thread;
  block?: number;
  showBoard?: boolean;
}) => {
  const {
    id,
    isPinned,
    isLocked,
    subject,
    op,
    replyCount,
    imageCount,
    replies,
    board,
  } = thread;
  const { image } = op;
  const { ipfsHash, isNsfw, isSpoiler } = image || {
    ipfsHash: "",
    isNsfw: false,
    isSpoiler: false,
  };

  const imgClassName =
    "w-full pointer-events-none shadow-xl object-contain max-h-320px";
  const [settings] = useSettings();
  const isLowScore = isLowScoreThread(
    thread,
    settings?.content_filter?.score_threshold
  );

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const history = useHistory();
  const { publish, subscribe, unsubscribe } = usePubSub();

  useEffect(() => {
    const sub = subscribe("THREAD_FOCUS", (_: any, id: string) => {
      const previousFocused = !!isFocused;
      const newIsFocused = `${id}` === `${thread.id}`;
      setIsFocused(newIsFocused);
      if (previousFocused && newIsFocused) {
        const url = Router.thread(thread);
        url && history.push(`${url}${block ? `?block=${block}` : ""}`);
      }
    });

    return () => {
      unsubscribe(sub);
    };
  });

  return (
    <article
      id={id}
      className="dchan-post justify-self-center relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden min-h-12rem max-h-320px max-w-150px break-word w-full h-full place-items-center flex"
      style={
        isFocused
          ? {
              maxHeight: "initial",
              maxWidth: "initial",
              zIndex: 900,
              marginLeft: "-2rem",
              marginRight: "-2rem",
              width: "14rem",
            }
          : {}
      }
    >
      {isLowScore && !isFocused ? (
        <button
          onClick={() => publish("THREAD_FOCUS", id)}
          className="absolute text-2xl text-gray-800 top-0 left-0 right-0 bottom-0"
        >
          <div>⚠️</div>
          <div>Post hidden due to reports.</div>
          <div className="text-sm text-gray-600">Click to show anyway.</div>
        </button>
      ) : (
        ""
      )}
      <button
        className="h-full w-full"
        onClick={() => publish("THREAD_FOCUS", id)}
      >
        <div
          className={[
            "relative",
            isFocused ? "bg-tertiary border border-black" : "",
            !isFocused && isLowScore ? "dchan-censor" : "",
          ].join(" ")}
        >
          <div className="absolute top-0 right-0 z-10">
            {isPinned ? (
              <span title="Thread pinned. This might be important.">📌</span>
            ) : (
              ""
            )}
            {isLocked ? (
              <span title="Thread locked. You cannot post.">🔒</span>
            ) : (
              ""
            )}
          </div>
          {ipfsHash && (!isLowScore || isFocused) ? (
            <div>
              <IPFSImage
                className={imgClassName}
                hash={ipfsHash}
                expandable={false}
                thumbnail={false}
                isSpoiler={isSpoiler}
                isNsfw={isNsfw || thread.board?.isNsfw || false}
              />
            </div>
          ) : (
            ""
          )}
          <div className="p-1">
            {showBoard && board ? (
              <div>
                /<BoardLink board={board} />/
              </div>
            ) : (
              ""
            )}
            <div>
              R:<strong>{replyCount}</strong>, I:<strong>{imageCount}</strong>
            </div>
            <div className="word-wrap">
              <div>
                <strong>{subject}</strong>
              </div>
              <PostBody
                style={{
                  minWidth: isFocused ? "12rem" : "initial",
                  textAlign: "center",
                }}
                post={op}
              />
              {isFocused &&
                replies &&
                [...replies].reverse().map((post) => (
                  <div
                    className="mt-1 p-1 border-0 border-t border-black border-solid text-xs text-left"
                    key={post.id}
                  >
                    <div>
                      {DateTime.fromSeconds(
                        parseInt(post.createdAtBlock.timestamp)
                      ).toRelative()}
                    </div>
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                      to={`${Router.post(post) || ""}${
                        block ? `?block=${block}` : ""
                      }`}
                    >
                      <PostBody post={post} />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
};

export default CatalogThread;
