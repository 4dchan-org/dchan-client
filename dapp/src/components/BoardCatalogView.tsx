import { Board, Thread } from "dchan";
import { isLowScore } from "dchan/entities/thread";
import useSettings from "hooks/useSettings";
import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Router } from "router";
import CatalogThread from "./catalog/CatalogThread";
import FilterSettings from "./FilterSettings";

export default function BoardCatalogView({
  board,
  threads,
}: {
  board?: Board;
  threads?: Thread[];
}) {
  const [settings] = useSettings();
  const [focused, setFocused] = useState<Thread | undefined>(undefined);
  const history = useHistory();

  const onFocus = useCallback(
    (newFocused: Thread) => {
      if (focused === newFocused && !!board) {
        const url = Router.thread(newFocused);
        url && history.push(url);
      } else {
        setFocused(newFocused);
      }
    },
    [board, focused, history, setFocused]
  );
  const filteredThreads = useMemo(
    () =>
      (threads || [])
        .filter((thread: Thread) => {
          return (
            settings?.content?.show_below_threshold ||
            !isLowScore(thread, settings?.content?.score_threshold)
          );
        })
        .map((thread: Thread) => (
          <CatalogThread
            onFocus={(e) => onFocus(thread)}
            isFocused={true === (focused && focused.n === thread.n)}
            thread={thread}
            key={thread.id}
          ></CatalogThread>
        )),
    [threads, settings, focused, onFocus]
  );

  return board && threads ? (
    threads.length === 0 ? (
      <div className="center grid">{`No threads.`}</div>
    ) : (
      <div>
        <div className="text-center">
          <FilterSettings
            summary={
              <span>
                Threads: {threads.length} (Hidden:{" "}
                {threads.length - filteredThreads.length}
                ), Posts: {board?.postCount}
              </span>
            }
          />
        </div>
        <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
          {filteredThreads}
        </div>

        <div className="flex center">
          [
          <HashLink
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            to="#board-header"
          >
            Top
          </HashLink>
          ]
        </div>
      </div>
    )
  ) : (
    <div/>
  );
}
