import AddressLabel from "components/AddressLabel";
import Menu from "components/Menu";
import Status from "components/Status";
import { Post, sendTip, Thread } from "dchan";
import { fromBigInt } from "dchan/entities/datetime";
import { isLowScore } from "dchan/entities/post";
import {
  banPost,
  lockThread,
  pinThread,
  removePost,
  reportPost,
  unlockThread,
  unpinThread,
} from "dchan/operations";
import useBlockNumber from "hooks/useBlockNumber";
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import useUser from "hooks/useUser";
import useWeb3 from "hooks/useWeb3";
import useFavorites from "hooks/useFavorites";
import { DateTime } from "luxon";
import { ReactElement, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Router } from "router";

export default function PostHeader({
  post,
  thread,
  backlinks,
  children,
}: {
  post: Post;
  thread?: Thread;
  backlinks?: object;
  children?: ReactElement;
}) {
  const {
    id,
    n,
    name,
    from: { address },
    createdAtBlock: { timestamp: createdAtUnix },
  } = post;
  const { provider, accounts } = useWeb3();
  const { publish } = usePubSub();
  const [settings] = useSettings();
  const { isJannyOf } = useUser();
  const isOwner = accounts.length > 0 && accounts[0] === address;
  const [status, setStatus] = useState<string | object>();
  const block = useBlockNumber();

  const createdAt = fromBigInt(createdAtUnix);
  const relativeTime = createdAt.toRelative();
  const formattedDate = `${
    // @ts-ignore
    createdAt.toLocaleString({ day: "2-digit", month: "2-digit", year: "2-digit" })
    }(${createdAt.weekdayShort
    })${createdAt.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
    }`;

  const isJanny = thread?.board?.id ? isJannyOf(thread.board.id) : false;

  const replyTo = useCallback(
    (from: string, n: number | string) => {
      publish("FORM_QUOTE", { from, n });
    },
    [publish]
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
  const canPin = isOp && isJanny;
  const canRemove = isOwner || isJanny;
  const canBan = isJanny;
  const canLock = isOp && (isOwner || isJanny);
  const postBacklinks: Post[] = backlinks ? Object.values(backlinks) : [];

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
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
    <span className="max-w-95vw inline-flex flex-wrap items-center relative">
      {isOp && thread ? (
        <button
          className={`inline-block ${favorite
              ? "opacity-60 hover:opacity-80"
              : "opacity-20 hover:opacity-40"}`
          }
          title={favorite ? "Remove from watched" : "Add to watched"}
          onClick={onFavorite}
        >
          👁
        </button>
      ) : (
        <span></span>
      )}
      <span className="px-0.5 whitespace-nowrap">
        <span className="text-accent font-bold">
          {!name || "" === name ? "Anonymous" : name}
        </span>
      </span>
      <span className="px-1 whitespace-nowrap text-sm">
        (ID: <AddressLabel etherscannable={true} address={address} />
        {provider ? (
          <button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 flex-grow opacity-50 hover:opacity-100"
            title="Send MATIC tip"
            onClick={() => onSendTip(address)}
          >
            💸
          </button>
        ) : (
          ""
        )}
        )
      </span>
      <span className="px-0.5 whitespace-nowrap text-sm" title={relativeTime !== null ? relativeTime : undefined}>
        {formattedDate} <span className="text-xs px-1 text-gray-400 hover:text-gray-600 hidden sm:inline-block">[<Link title={`Time travel to ${formattedDate}`}
          to={`${Router.post(post)}?block=${post.createdAtBlock.number}`}>{createdAt.toRelative()}</Link>]</span>
      </span>
      <span className="whitespace-nowrap">
        <span className="px-0.5 on-parent-target-font-bold text-sm whitespace-nowrap">
          <a
            href={`#${Router.post(post)}`}
            title="Link to this post"
          >
            No.
          </a>
          <button
            title="Reply to this post"
            onClick={() => replyTo(post.from.id, post.n)}
          >
            {n}
          </button>
        </span>
        <span>
          {isOp && isPinned ? (
            <span title="Thread pinned. This might be important.">📌</span>
          ) : (
            <span></span>
          )}
          {isOp && isLocked ? (
            <span title="Thread locked. You cannot reply anymore.">🔒</span>
          ) : (
            <span></span>
          )}
          {isLowScore(post, settings?.content_filter?.score_threshold) ? (
            <span title="Post hidden due to reports. Click to show anyway.">
              ⚠️
            </span>
          ) : (
            <span></span>
          )}
        </span>
          <Menu>
            <div>
              <Link to={`/${post.id}${block ? `?block=${block}` : ""}`} title="Permalink">
                🔗 Permalink
              </Link>
            </div>
            <div>
              <a href={`https://polygonscan.com/tx/${post.id}`} title="TX Details" target="_blank" rel="noreferrer">
                🔍 TX Details
              </a>
            </div>
            <div>
              <Link to={`${Router.post(post)}?block=${post.createdAtBlock.number}`}>
                ⏱️ Time travel to
              </Link>
            </div>
            {accounts && accounts[0] ? 
              <div>
                {canLock ? (
                  <div>
                    {thread && thread.isLocked ? (
                      <span>
                        <input name="lock" type="hidden" value="false"></input>
                        <button onClick={() => unlockThread(id, accounts, setStatus)}>
                          🔓 Unlock
                        </button>
                      </span>
                    ) : (
                      <span>
                        <input name="lock" type="hidden" value="true"></input>
                        <button onClick={() => lockThread(id, accounts, setStatus)}>
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
                    {thread && thread.isPinned ? (
                      <span>
                        <input name="sticky" type="hidden" value="false"></input>
                        <button onClick={() => unpinThread(id, accounts, setStatus)}>
                          📌 Unpin
                        </button>
                      </span>
                    ) : (
                      <span>
                        <input name="sticky" type="hidden" value="true"></input>
                        <button onClick={() => pinThread(id, accounts, setStatus)}>
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
                    <button onClick={() => removePost(id, accounts, setStatus)}>
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
              </div> : ""}
          </Menu>
      </span>
      {children}
      <span className="dchan-backlinks text-left text-sm flex flex-wrap">
        {postBacklinks?.map((post) => (
          <a
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-1"
            href={`#${Router.post(post)}`}
            onMouseEnter={() => publish("POST_HIGHLIGHT", post.id)}
            onMouseLeave={() => publish("POST_DEHIGHLIGHT", post.id)}
            key={post.id}
          >
            {`>>${post.n}`}
          </a>
        ))}
      </span>
      <Status status={status}></Status>
    </span>
  );
}
