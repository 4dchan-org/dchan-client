import { useQuery } from "@apollo/react-hooks";
import { Error, Loading } from "components";
import { Post, Thread } from "services/dchan/types";
import { queries } from "graphql/queries";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import { parse as parseQueryString } from "query-string";

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

export default function ReferencePage({ location, match: { params } }: any) {
  const [error, setError] = useState<string>();

  const history = useHistory();

  const id = `0x${params.id}`;
  const post_n = params.post_n;
  const post_ref = `${id}/${post_n}`;
  const query = parseQueryString(location.search);
  const block = `${query.block}`;
  let queriedBlock: number | undefined;
  if (block) {
    queriedBlock = parseInt(block);
    if (isNaN(queriedBlock)) {
      queriedBlock = undefined;
    }
  }

  const { loading, data } = useQuery<RefSearchData, RefSearchVars>(
    queriedBlock ? queries.query_ref_by_block : queries.query_ref,
    {
      variables: { id, post_n, post_ref, block: queriedBlock },
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

      let queriedBlockUrl = queriedBlock ? `?block=${queriedBlock}` : "";

      if (thread) {
        newLocation = `${Router.thread(thread)}${queriedBlockUrl}`;
      } else if (post) {
        newLocation = `${Router.post(post)}${queriedBlockUrl}`;
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
  }, [history, data, queriedBlock]);

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
