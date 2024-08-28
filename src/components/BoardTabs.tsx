import { BoardList, Loading } from "src/components";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "src/subgraph/types";
import { TabbedCard } from "src/components";
import { BOARD_TABS, BOARD_TABS_AT_BLOCK }  from "src/subgraph/graphql/queries";
import { useTimeTravel } from "src/hooks";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BoardListVars {}

export const BoardTabs = ({
  className = "",
  limit,
  highlight,
}: {
  className?: string;
  limit?: number;
  highlight?: Board;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const { data, loading } = useQuery<BoardListData, BoardListVars>(
    block ? BOARD_TABS_AT_BLOCK : BOARD_TABS,
    {
      // pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
      variables: { block, limit },
    }
  );

  return loading ? (
    <div className="border border-solid border-tertiary-accent flex-grow p-2"><Loading /></div>
  ) : data ? (
    <TabbedCard className={`${className} w-auto`} firstTab="Last bumped">
      {
        new Map([
          [
            "Most popular",
            <BoardList boards={data.mostPopular} highlight={highlight} />,
          ],
          [
            "Last created",
            <BoardList boards={data.lastCreated} highlight={highlight} />,
          ],
          [
            "Last bumped",
            <BoardList boards={data.lastBumped} highlight={highlight} />,
          ],
        ])
      }
    </TabbedCard>
  ) : (
    <span />
  );
}
