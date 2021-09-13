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
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import useUser from "hooks/useUser";
import useWeb3 from "hooks/useWeb3";
import { DateTime } from "luxon";
import { ReactElement, useCallback, useState } from "react";
import { Link } from "react-router-dom";

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

  const createdAt = fromBigInt(createdAtUnix);

  const isJanny = thread?.board?.id ? isJannyOf(thread.board.id) : false;

  const replyTo = useCallback(
    (from: string, n: number | string) => {
      publish("FORM_QUOTE", {from, n});
    },
    [publish]
  );

  const onSendTip = useCallback(
    async (to: string, amount?: number) => {
      try {
        amount = amount ? amount : parseFloat(prompt("How much? (MATIC)") || "");
        if (isNaN(amount)) {
          alert("Invalid amount");
          return;
        }
        console.log({amount})
        await sendTip(accounts[0], to, amount);
      } catch (e) {
        console.error({ onSendTipError: e });
      }
    },
    [accounts]
  );

  const focusPost = useCallback(
    (post: Post) => {
      publish("POST_FOCUS", post);
    },
    [publish]
  );

  const isPinned = thread?.isPinned;
  const isLocked = thread?.isLocked;

  const isOp = id === thread?.id;
  const canPin = isOp && isJanny;
  const canRemove = isOwner || isJanny;
  const canBan = isJanny;
  const canLock = isOp && (isOwner || isJanny);
  const postBacklinks: Post[] = backlinks ? Object.values(backlinks) : [];
  return (
    <span className="max-w-95vw">
      <span className="px-0.5 whitespace-nowrap">
        <span className="text-accent font-bold">
          {!name || "" === name ? "Anonymous" : name}
        </span>
      </span>
      <span className="px-1">
        <details className="inline">
          <summary>
            (<AddressLabel etherscannable={true} address={address} />)
          </summary>
          {provider ? (
            <div className="flex">
              (
              <button
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500 flex-grow"
                onClick={() => onSendTip(address)}
              >
                💸 Tip
              </button>
              )
            </div>
          ) : (
            ""
          )}
        </details>
      </span>
      <span className="px-0.5 whitespace-nowrap text-xs">
        {createdAt.toLocaleString(DateTime.DATETIME_SHORT)} (
        {createdAt.toRelative()})
      </span>
      <span className="px-0.5 on-parent-target-font-bold text-sm whitespace-nowrap">
        <button onClick={() => focusPost(post)} title="Link to this post">
          No.
        </button>
        <button title="Reply to this post" onClick={() => replyTo(post.from.id, post.n)}>
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
      {accounts && accounts[0] ? (
        <Menu>
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
        </Menu>
      ) : (
        ""
      )}
      <span className="px-0.5 text-xs opacity-10 hover:opacity-100">
        <Link to={`/${post.id}`} title="Permalink">
          🔗
        </Link>
      </span>
      {children}
      <span className="dchan-backlinks text-sm">
        {postBacklinks?.map((post) => (
          <button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 px-1"
            onClick={() => focusPost(post)}
            key={post.id}
          >{`>>${post.n}`}</button>
        ))}
      </span>
      <Status status={status}></Status>
    </span>
  );
}
