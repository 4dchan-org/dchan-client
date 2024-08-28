import { useQuery } from "@apollo/react-hooks";
import { useThrottleCallback } from "@react-hook/throttle";
import { Thread } from "src/subgraph/types";
import { THREADS_LIST_FAVORITES } from "src/subgraph/graphql/queries";
import { useLocalFavorites } from "src/hooks";
import truncate from "lodash/truncate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Router } from "src/router";
import { BoardLink, Loading, Emoji } from "src/components";
import { isExpired } from "src/subgraph/entities/thread";

export const WatchedThreadsWidget = () => {
  const { favorites, removeFavorite } = useLocalFavorites();
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );

  const {
    data: newData,
    loading,
    refetch,
  } = useQuery(THREADS_LIST_FAVORITES, {
    // pollInterval: 30_000,
    variables: {
      ids,
    },
    skip: !favorites,
  });

  const [data, setData] = useState(newData);
  useEffect(() => newData && setData(newData), [newData, setData]);

  const threads = data?.threads;
  const doRefetch = useCallback(() => refetch({ ids }), [refetch, ids]);
  const onRefresh = useThrottleCallback(doRefetch, 1, true);
  const onRemove = removeFavorite ? removeFavorite : () => ({});

  return favorites ? (
    <div className="bg-secondary border border-tertiary-accent p-1">
      {loading ? (
        <Loading />
      ) : ids.length > 0 && threads && threads.length > 0 ? (
        <div>
          <div className="mb-1">
            Watched threads:
            <span className="text-xs pl-2">
              [
              <button className="dchan-link" onClick={onRefresh}>
                Refresh
              </button>
              ]
            </span>
          </div>
          <div className="text-sm">
            {threads.map((thread: Thread) => {
              const board = thread.board;

              return (
                <div key={thread.id}>
                  <button onClick={() => onRemove(thread)}>
                    <Emoji emoji={"✖"} />
                  </button>{" "}
                  {board ? (
                    <span>
                      <BoardLink board={board} />
                    </span>
                  ) : (
                    ""
                  )}
                  <Link className="dchan-link" to={`${Router.thread(thread)}`}>
                    {" "}
                    - ({thread.replyCount}) -{" "}
                    {truncate(thread.subject || thread.op.comment, {
                      length: 32,
                    })}{" "}
                    {thread.isLocked ? <Emoji emoji={"🔒"} /> : ""}{" "}
                    {thread.isPinned ? <Emoji emoji={"📌"} /> : ""}
                    {isExpired(thread) ? <Emoji emoji={"📁"} /> : ""}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <span>
          No threads are being watched. Use the <Emoji emoji={"⭐️"} /> button
          on threads to keep track of them here.
        </span>
      )}
    </div>
  ) : (
    <div className="bg-secondary border border-tertiary-accent p-1">...</div>
  );
};
