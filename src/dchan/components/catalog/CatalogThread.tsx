import { Board, Thread } from "dchan/subgraph/types";
import { IPFSImage, BoardLink, Twemoji, PostBody } from "dchan/components";
import { isLowScore as isLowScoreThread } from "dchan/subgraph/entities/thread";
import { useSettings } from "dchan/hooks";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import { DateTime } from "luxon";
import { useState, useCallback } from "react";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const CatalogThread = ({
  thread,
  board,
  showBoard = false,
}: {
  thread: Thread;
  board?: Board;
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
  } = thread;
  const { image } = op;
  const { ipfsHash, isNsfw, isSpoiler } = image || {
    ipfsHash: "",
    isNsfw: false,
    isSpoiler: false,
  };

  const imgClassName =
    "w-full pointer-events-none shadow-xl object-contain max-h-320px";
    const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const history = useHistory();
  const [settings] = useSettings();
  const isLowScore = isLowScoreThread(
    thread,
    settings?.content_filter?.score_threshold
  );

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const goToThread = useCallback(() => {
    history.push(
      `${Router.thread(thread) || "/"}${block ? `?block=${block}` : ""}`
    );
  }, [history, thread, block]);

  const focusThread = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);

  const defocusThread = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  return (
    <div
      className="relative max-w-150px mx-1 w-full"
      style={{ minHeight: "20rem" }}
    >
      <article
        id={id}
        className="dchan-post justify-self-center text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden max-w-150px break-word w-full place-items-center flex"
        style={
          isFocused
            ? {
                maxWidth: "initial",
                zIndex: 40,
                marginLeft: "-2rem",
                marginRight: "-2rem",
                width: "14rem",
                position: "absolute",
              }
            : {
                minHeight: "20rem",
                position: "relative",
              }
        }
        onMouseEnter={focusThread}
        onMouseLeave={defocusThread}
      >
        {isLowScore && !isFocused ? (
          <button
            onClick={focusThread}
            className="absolute text-2xl text-gray-800 top-0 left-0 right-0 bottom-0"
          >
            <div>
              <Twemoji emoji={"⚠️"} />
            </div>
            <div>Post hidden due to reports.</div>
            <div className="text-sm text-gray-600">Click to show anyway.</div>
          </button>
        ) : (
          ""
        )}
        <div onClick={goToThread} className="h-full w-full">
          <div
            className={[
              !isFocused
                ? "absolute top-0 right-0 left-0"
                : "relative top-0 z-10 bg-tertiary border border-black h-full",
              !isFocused && isLowScore ? "dchan-censor" : "",
            ].join(" ")}
            style={{ maxHeight: "initial" }}
          >
            <div className="absolute top-0 right-0 z-10">
              {isPinned ? (
                <span title="Thread pinned. This might be important.">
                  <Twemoji emoji={"📌"} />
                </span>
              ) : (
                ""
              )}
              {isLocked ? (
                <span title="Thread locked. You cannot post.">
                  <Twemoji emoji={"🔒"} />
                </span>
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
                  isNsfw={
                    (isNsfw &&
                      !(true === board?.isNsfw) &&
                      !thread.board?.isNsfw) ||
                    false
                  }
                />
              </div>
            ) : (
              ""
            )}
            <div className="p-1">
              {showBoard && thread.board ? (
                <div>
                  <BoardLink
                    board={thread.board}
                  />
                </div>
              ) : (
                ""
              )}
              <div>
                <abbr title="Replies">R</abbr>: <strong>{replyCount}</strong>,{" "}
                <abbr title="Images">I</abbr>: <strong>{imageCount}</strong>
              </div>
              <div className="word-wrap">
                <div>
                  <strong className="text-url">{subject}</strong>
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
                      <PostBody post={post} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}