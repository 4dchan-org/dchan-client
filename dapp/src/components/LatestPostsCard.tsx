import { useQuery } from "@apollo/react-hooks";
import { Post } from "dchan";
import POSTS_GET_LAST from "graphql/queries/posts_get_last";
import Loading from "./Loading";
import PostSearchResult from "./PostSearchResult";

export default function LatestPostsCard() {
  const { query } = {
    query: POSTS_GET_LAST,
  };
  const { loading, data } = useQuery<{ posts: Post[] }, any>(query, {
    pollInterval: 5_000,
  });

  return (
    <div>
      {loading && !data ? (
        <Loading />
      ) : (
        data?.posts?.map((post) => <PostSearchResult post={post} key={post.id} />)
      )}
    </div>
  );
}
