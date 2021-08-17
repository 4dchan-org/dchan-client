import Menu from "components/Menu";
import Status from "components/Status";
import {
  backgroundColorAddress,
  Post,
  sendTip,
  shortenAddress,
  Thread,
} from "dchan";
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
import useUser from "hooks/useUser";
import useWeb3 from "hooks/useWeb3";
import { DateTime } from "luxon";
import { useCallback, useState } from "react";

(window as any).quotePost = function (quoting: any) {
  console.log({ quoting });
  PubSub.publish("FORM_QUOTE", quoting);
};

export default function PostHeader({
  post: {
    id,
    n,
    name,
    from: { address },
    createdAt: createdAtUnix,
  },
  thread,
  backlinks,
}: {
  post: Post;
  thread: Thread;
  backlinks?: object;
}) {
  const { accounts } = useWeb3();
  const { publish } = usePubSub();
  const { isJanny: fIsJanny } = useUser();
  const isOwner = accounts.length > 0 && accounts[0] === address;
  const [status, setStatus] = useState<string | object>();

  const createdAt = DateTime.fromMillis(parseInt(createdAtUnix) * 1000);

  const isJanny = !!thread ? fIsJanny(thread.board.id) : false;

  const replyTo = useCallback(
    (n: string) => {
      publish("FORM_QUOTE", n);
    },
    [publish]
  );

  const onSendTip = useCallback(async (to: string, amount?: number) => {
    try {
      amount = amount ? amount : parseInt(prompt("How many? (MATIC)") || "");
      if (isNaN(amount)) {
        alert("Invalid amount");
        return;
      }

      await sendTip(accounts[0], to, amount);
    } catch (e) {
      console.error({ onSendTipError: e });
    }
  }, []);

  const focusPost = useCallback(
    (id: string) => {
      publish("POST_FOCUS", id);
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
  const postBacklinks: Post[] = backlinks ? Object.values(backlinks) : []
  
  return (
    <span>
      <span className="px-0.5 whitespace-nowrap">
        <span className="text-accent font-bold">
          {!name || "" === name ? "Anonymous" : name}
        </span>
      </span>
      <span className="px-0.5">
        (
        <details className="inline">
          <summary>
            <a
              style={{ backgroundColor: backgroundColorAddress(address) }}
              className="font-family-tahoma text-readable-anywhere px-0.5 mx-0.5 rounded whitespace-nowrap"
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              <abbr style={{ textDecoration: "none" }} title={address}>
                {shortenAddress(address)}
              </abbr>
            </a>
          </summary>
          <div className="flex">
            <button
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500 flex-grow"
              onClick={() => onSendTip(address, 0.001)}
            >
              💸 Tip
            </button>
            <button
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              onClick={() => onSendTip(address)}
            >
              +
            </button>
          </div>
        </details>
        )
      </span>
      <span className="px-0.5 whitespace-nowrap text-xs">
        {createdAt.toLocaleString(DateTime.DATETIME_SHORT)} (
        {createdAt.toRelative()})
      </span>
      <span className="px-0.5 on-parent-target-font-bold font-family-tahoma whitespace-nowrap">
        <button onClick={() => focusPost(id)} title="Link to this post">
          No.
        </button>
        <button title="Reply to this post" onClick={() => replyTo(`${n}`)}>
          {n}
        </button>
      </span>
      <span className="dchan-backlinks">
        {postBacklinks?.map((post) => (
          <button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            onClick={() => focusPost(`${post.n}`)}
          >{`>>${post.n}`}</button>
        ))}
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
      </span>
      <Menu>
        {canLock ? (
          <div>
            {thread.isLocked ? (
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
            {thread.isPinned ? (
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
      <Status status={status}></Status>
    </span>
  );
}
