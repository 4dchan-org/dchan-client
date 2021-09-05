import { Board, Thread } from "dchan";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import CatalogThread from "./catalog/CatalogThread";

export default function BoardCatalogView({ board, threads }: { board: Board, threads: Thread[] }) {
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

  return (
    <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
      {threads.map((thread) => <CatalogThread
              onFocus={(e) => onFocus(thread)}
              isFocused={true === (focused && focused.n === thread.n)}
              thread={thread}
              key={thread.id}
            ></CatalogThread>)}
    </div>
  );
}
