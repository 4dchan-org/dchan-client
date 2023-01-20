import { useQuery } from "@apollo/react-hooks";
import { Board, Post } from "dchan/subgraph/types";
import { POSTS_GET_LAST, POSTS_GET_LAST_BLOCK } from "dchan/subgraph/graphql/queries";
import { Loading, PostSearchResult } from ".";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const LatestPostsCard = ({
  limit,
  skip,
  board,
}: {
  limit?: number;
  skip?: number;
  board?: Board;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const query = block ? POSTS_GET_LAST_BLOCK : POSTS_GET_LAST;
  const { loading, data } = useQuery<{ posts: Post[] }, any>(query, {
    pollInterval: 5_000,
    variables: {
      block,
      limit,
      skip,
      board: board?.id || "",
    },
  });

  return (
    <div>
      {loading && !data ? (
        <Loading />
      ) : (
        data?.posts?.map((post) => (
          <PostSearchResult
            post={post}
            key={post.id}
          />
        )) || <div>No post found</div>
      )}
    </div>
  );
}
