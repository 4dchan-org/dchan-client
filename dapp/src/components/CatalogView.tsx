import { Thread } from "dchan";
import CatalogThread from "./catalog/CatalogThread";
import { RefObject, createRef, useEffect } from "react";
import usePubSub from "hooks/usePubSub";

export default function CatalogView({
  threads,
  block,
  showBoard = false
}: {
  threads: Thread[];
  block?: number,
  showBoard?: boolean
}) {
  let threadRefs: RefObject<HTMLElement>[] = [];
  let threadElements = [];

  for (const thread of threads.filter(t => !!t && !!t.board)) {
    const threadRef = createRef<HTMLElement>();
    threadRefs.push(threadRef);
    threadElements.push(<CatalogThread
      ref={threadRef}
      thread={thread}
      key={thread.id}
      block={block}
      showBoard={showBoard}
    />);
  }

  const { publish } = usePubSub();

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (threadRefs.every(ref => ref && ref.current && !ref.current.contains(event.target))) {
        publish("THREAD_FOCUS", "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
      {threadElements}
    </div>
  );
}
