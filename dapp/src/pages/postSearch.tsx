import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { DateTime } from "luxon";
import SearchResultsView from "components/SearchResultsView";
import ContentHeader from "components/ContentHeader";

export default function PostSearchPage({ location, match: { params } }: any) {
  const query = parseQueryString(location.search);
  const s = query.s || query.search;
  const search = isString(s) ? s : "";

  const lastBlock = useLastBlock();

  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;
  const block = parseInt(`${query.block || lastBlock?.number || ""}`);
  
  return (
    <div
      className="bg-primary min-h-100vh"
      data-theme={"blueboard"}
    >
      <ContentHeader dateTime={dateTime} block={block} search={search} />

      <div>
        <SearchResultsView search={search} block={block} />
      </div>

      <div id="bottom" />
      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
