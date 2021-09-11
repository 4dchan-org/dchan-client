import { useQuery } from "@apollo/react-hooks";
import { useThrottleCallback } from "@react-hook/throttle";
import { Thread } from "dchan";
import THREADS_LIST_FAVORITES from "graphql/queries/threads/list_favorites";
import useFavorites from "hooks/useFavorites";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Router } from "router";
import BoardLink from "./BoardLink";

export default function FavoritesWidget() {
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
        <label htmlFor="dchan-favorites" onClick={onClick}>
          ⭐
        </label>
      </summary>
      <div className="mx-1 text-center bg-primary">
        {loading ? (
          "Loading..."
        ) : ids.length > 0 && threads ? (
          <div>
            <div className="mb-2">
              <button onClick={onRefresh}>🔃</button> Favorite threads:
            </div>
            <div className="text-sm">
              {threads.map((thread: Thread) => {
                const board = thread.board;

                return (
                  <div>
                    <button onClick={() => onRemove(thread)}>✖</button>{" "}
                    <Link
                      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                      to={`${Router.thread(thread)}`}
                    >
                      ({thread.replyCount}) -{" "}
                      {board ? (
                        <span>
                          /<BoardLink board={board} />/
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      - {thread.subject || thread.op.comment}{" "}
                      {thread.isLocked ? "🔒" : ""}{" "}
                      {thread.isPinned ? "📌" : ""}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          "No favorites. Use the ⭐ button on threads to keep track of them here."
        )}
      </div>
    </details>
  ) : (
    <span />
  );
}
