import { Thread } from "dchan";
import CatalogThread from "./catalog/CatalogThread";

export default function CatalogView({
  threads,
  block
}: {
  threads: Thread[];
  block?: number
}) {
  return (
    <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 sm:px-8">
      {threads.filter(t => !!t && !!t.board).map((thread) => (
        <CatalogThread thread={thread} key={thread.id} block={block}></CatalogThread>
      ))}
    </div>
  );
}
