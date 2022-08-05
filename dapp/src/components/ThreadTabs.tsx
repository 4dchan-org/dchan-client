import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan";
import { TabbedCard } from "components";
import THREAD_TABS from "graphql/queries/threads/tabs";
import THREAD_TABS_AT_BLOCK from "graphql/queries/threads/tabs_at_block";
import Loading from "./Loading";
import { useTraveledBlock } from "./TimeTravelWidget";
import { useMemo } from "react";
import { DateTime } from "luxon";
import CatalogView from "./CatalogView";

interface ThreadListData {
  mostPopular: Thread[];
  lastBumped: Thread[];
  lastCreated: Thread[];
}

interface ThreadListVars {}

export default function ThreadTabs({
  className = "",
  block,
  limit,
  board
}: {
  className?: string;
  block?: number;
  limit?: number;
  highlight?: Thread;
  board?: Board;
}) {
  const currentBlock = useTraveledBlock();
  const cutoff = useMemo(
    () => Math.floor(
      (currentBlock ? parseInt(currentBlock.timestamp) : DateTime.now().toSeconds()) - (60 * 60 * 24 * 30)
    ),
    [currentBlock]
  );
  const { data, loading } = useQuery<ThreadListData, ThreadListVars>(
    block ? THREAD_TABS_AT_BLOCK : THREAD_TABS,
    {
      pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
      variables: { block, limit, cutoff, board: board?.id || "" },
    }
  );

  return loading ? (
    <div className="border border-solid border-black flex-grow p-2"><Loading /></div>
  ) : data ? (
    <TabbedCard className={`${className} w-auto`}>
      {
        new Map([
          [
            "Most popular",
            data.mostPopular.length ? <CatalogView threads={data.mostPopular} block={block} showBoard={true} /> : <div className="p-4">No active threads.</div>,
          ],
          [
            "Last created",
            data.lastCreated.length ? <CatalogView threads={data.lastCreated} block={block} showBoard={true} /> : <div className="p-4">No active threads.</div>,
          ],
          [
            "Last bumped",
            data.lastBumped.length ? <CatalogView threads={data.lastBumped} block={block} showBoard={true} /> : <div className="p-4">No active threads.</div>,
          ],
        ])
      }
    </TabbedCard>
  ) : (
    <span />
  );
}
