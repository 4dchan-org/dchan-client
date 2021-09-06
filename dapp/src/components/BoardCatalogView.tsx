import { Board, Thread } from "dchan";
import CatalogThread from "./catalog/CatalogThread";

export default function BoardCatalogView({
  board,
  threads,
}: {
  board?: Board;
  threads: Thread[];
}) {
  return (
    <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
      {threads.map((thread) => (
        <CatalogThread thread={thread} key={thread.id}></CatalogThread>
      ))}
    </div>
  );
}
