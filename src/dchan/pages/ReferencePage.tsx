import { useQuery } from "@apollo/react-hooks";
import { Error, Loading } from "dchan/components";
import { Post, Thread } from "dchan/subgraph/types";
import { queries } from "dchan/subgraph/graphql/queries";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import useTimeTravel from "dchan/hooks/useTimeTravel";

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

export const ReferencePage = ({ location, match: { params } }: any) => {
  const [error, setError] = useState<string>();

  const history = useHistory();

  const id = `0x${params.id}`;
  const post_n = params.post_n;
  const post_ref = `${id}/${post_n}`;
  const { timeTraveledToBlockNumber: block } = useTimeTravel()

  const { loading, data } = useQuery<RefSearchData, RefSearchVars>(
    block ? queries.query_ref_by_block : queries.query_ref,
    {
      variables: { id, post_n, post_ref, block: block },
    }
  );

  useEffect(() => {
    if (data) {
      let newLocation = null;
      let thread = null;
      let post = null;

      let { threads, posts, postRef } = data;

      if (threads && threads.length > 0) {
        thread = threads[0];
      } else if (posts && posts.length > 0) {
        post = posts[0];
      } else if (postRef) {
        post = postRef.post;
      }

      let blockUrl = block ? `?block=${block}` : "";

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
        history.replace(newLocation);
      }
    }
  }, [history, data, block]);

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
}
