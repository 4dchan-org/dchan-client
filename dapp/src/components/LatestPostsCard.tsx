import { useQuery } from "@apollo/react-hooks";
import { Post } from "dchan";
import POSTS_GET_LAST from "graphql/queries/posts_get_last";
import Card from "./Card";
import Loading from "./Loading";
import PostSearchResult from "./PostSearchResult";

export default function LatestPostsCard() {
  const { query } = {
    query: POSTS_GET_LAST,
  };
  const { loading, data } = useQuery<{ posts: Post[] }, any>(query, {
    pollInterval: 30_000,
  });

  return (
    <Card className="max-w-100vw mx-auto" title={<span>Latest Posts</span>}>
      <div>
        {loading && !data ? (
          <Loading />
        ) : (
          data?.posts?.map((post) => <PostSearchResult post={post} key={post.id} />)
        )}
      </div>
    </Card>
  );
}
