import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan/subgraph/types";
import { TabbedCard } from "dchan/components";
import { THREADS_TABS, THREADS_TABS_BLOCK } from "dchan/subgraph/graphql/queries";
import { Loading, CatalogView } from ".";
import { useTraveledBlock } from "./TimeTravelWidget";
import { useMemo } from "react";
import { DateTime } from "luxon";

interface ThreadListData {
  mostPopular: Thread[];
  lastBumped: Thread[];
  lastCreated: Thread[];
}

interface ThreadListVars {}

export const ThreadTabs = ({
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
}) => {
  const currentBlock = useTraveledBlock();
  const cutoff = useMemo(
    () => Math.floor(
      (currentBlock ? parseInt(currentBlock.timestamp) : DateTime.now().toSeconds()) - (60 * 60 * 24 * 30)
    ),
    [currentBlock]
  );
  const { data, loading } = useQuery<ThreadListData, ThreadListVars>(
    block ? THREADS_TABS_BLOCK : THREADS_TABS,
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
