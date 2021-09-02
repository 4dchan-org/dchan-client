import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import BoardCatalogView from "components/BoardCatalogView";
import { DateTime } from "luxon";

export default function BoardPage({ location, match: { params } }: any) {
  let { board_id } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const lastBlock = useLastBlock();
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block || lastBlock?.number || "0"}`);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;
  
  return (
    <div
      className="bg-primary min-h-100vh"
    >
      <BoardCatalogView board={board_id} block={block} dateTime={dateTime} />

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
