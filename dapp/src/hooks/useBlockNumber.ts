import { parse as parseQueryString } from "query-string";
import { useHistory } from "react-router";

export default function useBlockNumber() {
  const history = useHistory();
  const query = parseQueryString(history.location.search);
  const queriedBlock = parseInt(`${query.block}`);
  return isNaN(queriedBlock) ? undefined : queriedBlock;
}