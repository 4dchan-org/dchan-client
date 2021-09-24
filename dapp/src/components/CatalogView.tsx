import { Thread } from "dchan";
import CatalogThread from "./catalog/CatalogThread";

export default function CatalogView({
  threads,
  block,
  showBoard = false
}: {
  threads: Thread[];
  block?: number,
  showBoard?: boolean
}) {
  return (
    <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
      {threads.filter(t => !!t && !!t.board).map(thread => (
        <CatalogThread
          thread={thread}
          key={thread.id}
          block={block}
          showBoard={showBoard}
        />
      ))}
    </div>
  );
}
