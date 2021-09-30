import { useQuery } from "@apollo/react-hooks";
import { useThrottleCallback } from "@react-hook/throttle";
import { Thread } from "dchan";
import THREADS_LIST_FAVORITES from "graphql/queries/threads/list_favorites";
import useFavorites from "hooks/useFavorites";
import { truncate } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Router } from "router";
import BoardLink from "./BoardLink";
import Loading from "./Loading";

export default function WatchedThreadsWidget() {
  const { favorites, removeFavorite } = useFavorites();
  const [open, setOpen] = useState<boolean>(false);
  const onClick = useCallback(() => setOpen(true), [setOpen]);
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );

  const { data, loading, refetch } = useQuery(THREADS_LIST_FAVORITES, {
    pollInterval: 30_000,
    variables: {
      ids,
    },
    skip: !favorites,
  });

  const threads = data?.threads;
  const doRefetch = useCallback(() => refetch({ ids }), [refetch, ids]);
  const onRefresh = useThrottleCallback(doRefetch, 1, true);
  const onRemove = removeFavorite ? removeFavorite : () => {};

  return favorites ? (
    <details open={open}>
      <summary>
        <label htmlFor="dchan-watched" onClick={onClick}>
          👁
        </label>
      </summary>
      <div className="mx-1 text-center bg-primary">
        {loading ? (
          <Loading />
        ) : ids.length > 0 && threads ? (
          <div>
            <div className="mb-2">Watched threads:</div>
            <div className="text-sm">
              {threads.map((thread: Thread) => {
                const board = thread.board;

                return (
                  <div key={thread.id}>
                    <button onClick={() => onRemove(thread)}>✖</button>{" "}
                    {board ? (
                      <span>
                        /<BoardLink board={board} />/
                      </span>
                    ) : (
                      ""
                    )}
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                      to={`${Router.thread(thread)}`}
                    >
                      {" "}
                      - ({thread.replyCount}) -{" "}
                      {truncate(thread.subject || thread.op.comment, {
                        length: 32,
                      })}{" "}
                      {thread.isLocked ? "🔒" : ""}{" "}
                      {thread.isPinned ? "📌" : ""}
                    </Link>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="text-xs">
                [
                <button
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  onClick={onRefresh}
                >
                  Refresh
                </button>
                ]
              </div>
            </div>
          </div>
        ) : (
          "No posts are being watched. Use the 👁 button on threads to keep track of them here."
        )}
      </div>
    </details>
  ) : (
    <span />
  );
}
