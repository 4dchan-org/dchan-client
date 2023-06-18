import { useQuery } from "@apollo/react-hooks";
import { Board, Post } from "src/subgraph/types";
import { POSTS_GET_LAST, POSTS_GET_LAST_BLOCK } from "src/subgraph/graphql/queries";
import { Loading, PostSearchResult } from ".";
import { useEffect, useState } from "react";
import { useTimeTravel } from "src/hooks";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading, data: newData } = useQuery<{ posts: Post[] }, any>(query, {
    pollInterval: 10_000,
    variables: {
      block,
      limit,
      skip,
      board: board?.id || "",
    },
  });
  const [data, setData] = useState(newData)
  useEffect(() => newData && setData(newData), [newData, setData])

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
