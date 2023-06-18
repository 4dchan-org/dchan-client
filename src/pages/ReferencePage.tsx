import { useQuery } from "@apollo/react-hooks";
import { Error, Loading } from "src/components";
import { Post, Thread } from "src/subgraph/types";
import { queries } from "src/subgraph/graphql/queries";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Router } from "src/router";
import { useTimeTravel } from "src/hooks";
interface RefSearchData {
  threads: Thread[];
  posts: Post[];
  postRef: {
    post: Post;
  };
}
interface RefSearchVars {
  id: string;
  post_n: string;
  post_ref: string;
  block?: number;
}

export const ReferencePage = () => {
  const params = useParams();

  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  const { board_name: id, board_id: post_n } = params;
  const post_ref = `${id}/${post_n}`;
  const { timeTraveledToBlockNumber: block } = useTimeTravel();

  const { loading, data } = useQuery<RefSearchData, RefSearchVars>(
    block ? queries.query_ref_by_block : queries.query_ref,
    {
      variables: { id: id || "", post_n: post_n || "", post_ref, block: block },
    }
  );

  useEffect(() => {
    if (data) {
      let newLocation = null;
      let thread = null;
      let post = null;

      const { threads, posts, postRef } = data;

      if (threads && threads.length > 0) {
        thread = threads[0];
      } else if (posts && posts.length > 0) {
        post = posts[0];
      } else if (postRef) {
        post = postRef.post;
      }

      const blockUrl = block ? `?block=${block}` : "";

      if (thread) {
        newLocation = `${Router.thread(thread)}${blockUrl}`;
      } else if (post) {
        newLocation = `${Router.post(post)}${blockUrl}`;
      }

      if ((thread || post || postRef) && !newLocation) {
        setError(
          "Content not found. It may have been deleted, or the ID is invalid."
        );
      }

      if (newLocation) {
        navigate(newLocation, { replace: true });
      }
    }
  }, [data, block, navigate]);

  return (
    <div className="bg-primary center grid w-screen h-screen">
      {error ? (
        <Error subject={"Not found"}>
          <span>{error}</span>
        </Error>
      ) : (
        <div>
          {loading ? <Loading /> : ""}
          <div className="text-xs">
            {id}/{post_n}
          </div>
        </div>
      )}
    </div>
  );
};
