import { BoardList, Loading } from "components";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan/subgraph/types";
import { TabbedCard } from "components";
import { BOARD_TABS, BOARD_TABS_AT_BLOCK }  from "dchan/subgraph/graphql/queries";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars {}

export const BoardTabs = ({
  className = "",
  block,
  limit,
  highlight,
}: {
  className?: string;
  block?: number;
  limit?: number;
  highlight?: Board;
}) => {
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
            <BoardList boards={data.mostPopular} block={block} highlight={highlight} />,
          ],
          [
            "Last created",
            <BoardList boards={data.lastCreated} block={block} highlight={highlight} />,
          ],
          [
            "Last bumped",
            <BoardList boards={data.lastBumped} block={block} highlight={highlight} />,
          ],
        ])
      }
    </TabbedCard>
  ) : (
    <span />
  );
}
