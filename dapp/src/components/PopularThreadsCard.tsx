import { useQuery } from "@apollo/react-hooks";
import { Thread } from "dchan";
import THREADS_LIST_MOST_POPULAR from "graphql/queries/threads/list_most_popular";
import CatalogView from "./CatalogView";
import Card from "./Card";
import Loading from "./Loading";

export default function PopularThreadsCard() {
  const { query } = {
    query: THREADS_LIST_MOST_POPULAR,
  };
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 30_000,
  });

  return (
    <Card className="w-100vw max-w-initial p-2" title={<span>Popular threads</span>}>
      {loading ? <Loading /> : <CatalogView threads={data?.threads || []} />}
    </Card>
  );
}
