import { Menu, Status, UserLabel, Emoji } from "src/components";
import { sendTip } from "src/services/web3";
import { Post, Thread } from "src/subgraph";
import { fromBigInt } from "src/services/datetime";
import { isLowScore } from "src/subgraph/entities/post";
import {
  banPost,
  lockThread,
  pinThread,
  removePost,
  reportPost,
  unlockThread,
  unpinThread,
} from "src/actions";
import {
  usePubSub,
  useLocalSettings,
  useUser,
  useWeb3,
  useLocalFavorites,
  useTimeTravel,
} from "src/hooks";
import { DateTime } from "luxon";
import { ReactElement, useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Router } from "src/router";
import qs from "query-string";
import { isExpired } from "src/subgraph/entities/thread";

export const DateDisplay = ({ post }: { post: Post }) => {
  const createdAt = fromBigInt(post.createdAtBlock.timestamp);
  const { currentBlock } = useTimeTravel();
  const relativeTime = createdAt.toRelative();
  const base = currentBlock ? fromBigInt(currentBlock.timestamp) : undefined;
  const traveledRelativeTime =
    base && createdAt.diff(base).milliseconds
      ? createdAt.toRelative({
          base,
        })
      : "Now";
  const formattedDate = `${createdAt.toLocaleString({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })}(${createdAt.weekdayShort})${createdAt.toLocaleString(
    DateTime.TIME_24_WITH_SECONDS
  )}`;

  const location = useLocation();
  const locationParams = qs.parse(location.search);
  locationParams.block = `${post.createdAtBlock.number}`;
  const timeTravelLink = `${location.pathname}?${new URLSearchParams(
    locationParams as any
  ).toString()}`;

  return (
    <span
      className="px-0.5 whitespace-nowrap text-sm flex center"
      title={relativeTime !== null ? relativeTime : undefined}
    >
      {formattedDate}
      <span className="text-xs px-1 opacity-20 hover:opacity-100 inline-block">
        [
        <Link title={`Time travel to ${formattedDate}`} to={timeTravelLink}>
          {currentBlock ? (
            <span>
              {traveledRelativeTime} ({relativeTime})
            </span>
          ) : (
            relativeTime
          )}
        </Link>
        ]
      </span>
    </span>
  );
};

export const PostHeader = ({
  post,
  thread,
  backlinks,
  children,
}: {
  post: Post;
  thread?: Thread;
  backlinks?: object;
  children?: ReactElement;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const {
    id,
    n,
    name,
    from: { address },
  } = post;
  const { accounts } = useWeb3();
  const { publish } = usePubSub();
  const [settings] = useLocalSettings();
  const selfUser = useUser();
  const postUser = useUser(address);
  const isOwner = accounts.length > 0 && accounts[0] === address;
  const [status, setStatus] = useState<string | object>();

  const isSelfJanny = thread?.board?.id && selfUser.isJannyOf(thread.board.id);
  const isPostUserAdmin = postUser.isAdmin();
  const isPostUserJanny =
    thread?.board?.id && postUser.isJannyOf(thread?.board.id);

  const replyTo = useCallback(
    (from: string, n: number | string) => {
      publish("FORM_QUOTE", {
        n,
        ...(thread &&
        [...(thread.replies || thread.lastReplies || []), thread.op].filter((post) => post.n === n)
          .length > 1
          ? { from }
          : {}),
      });
    },
    [thread, publish]
  );

  const onSendTip = useCallback(
    async (to: string, amount?: number) => {
      try {
        amount = amount
          ? amount
          : parseFloat(prompt("How much? (MATIC)") || "");
        if (isNaN(amount)) {
          alert("Invalid amount");
          return;
        }
        await sendTip(accounts[0], to, amount);
      } catch (e) {
        console.error({ onSendTipError: e });
      }
    },
    [accounts]
  );

  const isPinned = thread?.isPinned;
  const isLocked = thread?.isLocked;

  const isOp = id === thread?.id;
  const canPin = isOp && isSelfJanny;
  const canRemove = isOwner || isSelfJanny;
  const canBan = isSelfJanny;
  const canLock = isOp && (isOwner || isSelfJanny);
  const postBacklinks: Post[] = backlinks ? Object.values(backlinks) : [];

  const { isFavorite, addFavorite, removeFavorite } = useLocalFavorites();
  const favorite = thread && isFavorite ? isFavorite(thread) : false;

  const onFavorite = useCallback(() => {
    if (thread && removeFavorite && addFavorite) {
      if (favorite) {
        removeFavorite(thread);
      } else {
        addFavorite(thread);
      }
    }
  }, [addFavorite, removeFavorite, thread, favorite]);

  return (
    <span className="max-w-95vw inline-flex flex-wrap items-center">
      {isOp && thread ? (
        <button
          className={`inline-block ${
            favorite
              ? "opacity-70 hover:opacity-100"
              : "opacity-40 hover:opacity-70"
          }`}
          title={favorite ? "Remove from watched" : "Add to watched"}
          onClick={onFavorite}
        >
          <Emoji emoji={favorite ? "🌟" : "⭐️"} />
        </button>
      ) : (
        <span></span>
      )}
      <span className="px-0.5 break-all">
        <span
          className={`font-bold font-size-090rem ${
            isPostUserAdmin
              ? "text-red-600"
              : isPostUserJanny
              ? "text-purple-600"
              : "text-accent"
          }`}
          title={
            isPostUserAdmin
              ? "This user is an administrator."
              : isPostUserJanny
              ? "This user is a moderator for this board."
              : ""
          }
        >
          {!name || "" === name ? "Anonymous" : name}
          {isPostUserAdmin ? " ## Admin" : isPostUserJanny ? " ## Mod" : ""}
        </span>
      </span>
      <span className="px-1 whitespace-nowrap text-xs">
        (ID: <UserLabel user={post.from} /> )
      </span>
      <DateDisplay post={post} />
      <span className="whitespace-nowrap flex center">
        <span className="px-0.5 on-parent-target-font-bold text-sm whitespace-nowrap">
          <Link
            className="dchan-link"
            to={`${Router.post(post)}${block ? `?block=${block}` : ""}`}
            title="Link to this post"
          >
            No.
          </Link>
          <span
            className="dchan-link"
            title="Reply to this post"
            onClick={() => replyTo(post.from.id, post.n)}
          >
            {n}
          </span>
        </span>
        <Menu>
          <div>
            <a
              href={`https://polygonscan.com/tx/${post.id}`}
              title="TX Details"
              target="_blank"
              rel="noreferrer"
            >
              <Emoji emoji={"🔍"} /> TX Details
            </a>
          </div>
          <div>
            <Link
              to={`${Router.post(post)}?block=${post.createdAtBlock.number}`}
            >
              <Emoji emoji={"⏱️"} /> Time travel to
            </Link>
          </div>
          {accounts && accounts[0] ? (
            <div>
              {canLock ? (
                <div>
                  {thread && thread.isLocked ? (
                    <span>
                      <input name="lock" type="hidden" value="false"></input>
                      <button
                        onClick={() => unlockThread(id, accounts, setStatus)}
                      >
                        <Emoji emoji={"🔓"} /> Unlock
                      </button>
                    </span>
                  ) : (
                    <span>
                      <input name="lock" type="hidden" value="true"></input>
                      <button
                        onClick={() => lockThread(id, accounts, setStatus)}
                      >
                        <Emoji emoji={"🔒"} /> Lock
                      </button>
                    </span>
                  )}
                </div>
              ) : (
                ""
              )}
              {canPin ? (
                <div>
                  {thread && thread.isPinned ? (
                    <span>
                      <input name="sticky" type="hidden" value="false"></input>
                      <button
                        onClick={() => unpinThread(id, accounts, setStatus)}
                      >
                        <Emoji emoji={"📌"} /> Unpin
                      </button>
                    </span>
                  ) : (
                    <span>
                      <input name="sticky" type="hidden" value="true"></input>
                      <button
                        onClick={() => pinThread(id, accounts, setStatus)}
                      >
                        <Emoji emoji={"📌"} /> Pin
                      </button>
                    </span>
                  )}
                </div>
              ) : (
                ""
              )}
              {canRemove ? (
                <div>
                  <button onClick={() => removePost(id, accounts, setStatus)}>
                    <Emoji emoji={"❌"} /> Remove
                  </button>
                </div>
              ) : (
                ""
              )}
              {canBan ? (
                <div>
                  <button onClick={() => banPost(id, accounts, setStatus)}>
                    <Emoji emoji={"🔫"} /> Ban
                  </button>
                </div>
              ) : (
                ""
              )}
              <div>
                <button onClick={() => reportPost(id, accounts, setStatus)}>
                  <Emoji emoji={"⚠️"} /> Report
                </button>
              </div>
              <div>
                <button
                  title="Send MATIC tip"
                  onClick={() => onSendTip(address)}
                >
                  💸 Send Tip
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </Menu>
        <span className="flex gap-1">
          {isOp && isPinned ? (
            <span title="Thread pinned. This might be important.">
              <Emoji emoji={"📌"} />
            </span>
          ) : (
            <></>
          )}
          {isOp && isLocked ? (
            <span title="Thread locked. You cannot reply anymore.">
              <Emoji emoji={"🔒"} />
            </span>
          ) : (
            <></>
          )}
          {isOp && isExpired(thread) ? (
            <span title="Thread archived. You can still reply.">
              <Emoji emoji={"📁"} />
            </span>
          ) : (
            <></>
          )}
          {isLowScore(post, settings?.content_filter?.score_threshold) ? (
            <span title="Post hidden due to reports. Click to show anyway.">
              <Emoji emoji={"⚠️"} />
            </span>
          ) : (
            <></>
          )}
        </span>
      </span>
      {children}
      <span className="dchan-backlinks text-left text-xs flex flex-wrap">
        {postBacklinks?.map((post) => (
          <Link
            className="dchan-link px-1"
            to={`${Router.post(post)}${block ? `?block=${block}` : ""}`}
            onMouseEnter={() => publish("POST_HIGHLIGHT", post.id)}
            onMouseLeave={() => publish("POST_DEHIGHLIGHT", post.id)}
            key={post.id}
          >
            {`>>${post.n}`}
          </Link>
        ))}
      </span>
      <Status status={status}></Status>
    </span>
  );
};
