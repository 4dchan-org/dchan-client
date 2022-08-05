import BoardList from "components/board/list";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import { TabbedCard } from "components";
import BOARD_TABS from "graphql/queries/boards/tabs";
import BOARD_TABS_AT_BLOCK from "graphql/queries/boards/tabs_at_block";
import Loading from "./Loading";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars {}

export default function BoardTabs({
  className = "",
  block,
  limit,
  highlight,
}: {
  className?: string;
  block?: number;
  limit?: number;
  highlight?: Board;
}) {
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
