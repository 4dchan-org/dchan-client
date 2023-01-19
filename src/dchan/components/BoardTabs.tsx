import { BoardList, Loading } from "dchan/components";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan/subgraph/types";
import { TabbedCard } from "dchan/components";
import { BOARD_TABS, BOARD_TABS_AT_BLOCK }  from "dchan/subgraph/graphql/queries";
import useTimeTravel from "dchan/hooks/useTimeTravel";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

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
      pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
      variables: { block, limit },
    }
  );

  return loading ? (
    <div className=""><Loading /></div>
  ) : data ? (
    <TabbedCard className={`${className} w-auto`}>
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
