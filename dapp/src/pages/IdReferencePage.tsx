import { useQuery } from "@apollo/react-hooks";
import { Error, Loading, StillStuck } from "components";
import { Board, BoardRef, Post, PostRef, Thread, ThreadRef } from "dchan/subgraph/types";
import { SEARCH_BY_ID, SEARCH_BY_ID_BLOCK } from "dchan/subgraph/graphql/queries";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import { parse as parseQueryString } from "query-string";

interface IdSearchData {
  boardRef: BoardRef;
  threadRef: ThreadRef;
  postRef: PostRef;
  board: Board;
  thread: Thread;
  post: Post;
}
interface IdSearchVars {
  id: string;
  block?: number;
}

export const IdReferencePage = ({ location, match: { params } }: any) => {
  const [error, setError] = useState<string>();
  const history = useHistory();

  const id = `0x${params.id}`;
  const query = parseQueryString(location.search);
  const block = `${query.block}`;
  let queriedBlock: number | undefined;
  if (block) {
    queriedBlock = parseInt(block);
    if (isNaN(queriedBlock)) {
      queriedBlock = undefined;
    }
  }

  const graphQuery = queriedBlock ? SEARCH_BY_ID_BLOCK : SEARCH_BY_ID;

  const { data } = useQuery<IdSearchData, IdSearchVars>(graphQuery, {
    variables: { id, block: queriedBlock },
    pollInterval: 5_000,
  });

  useEffect(() => {
    if (data) {
      let location = null;

      let { boardRef, threadRef, postRef, board, thread, post } = data;

      if (!board && boardRef) {
        board = boardRef.board;
      } else if (!thread && threadRef) {
        thread = threadRef.thread;
      } else if (!post && postRef) {
        post = postRef.post;
      }

      let queriedBlockUrl = queriedBlock ? `?block=${queriedBlock}` : "";

      if (board) {
        location = `${Router.board(board)}${queriedBlockUrl}`;
      } else if (thread) {
        location = `${Router.thread(thread)}${queriedBlockUrl}`;
      } else if (post) {
        location = `${Router.post(post)}${queriedBlockUrl}`;
      }

      if ((board || thread || post) && !location) {
        setError(
          "Content not found. It may have been deleted, or the ID is invalid."
        );
      }

      if (location) {
        history.replace(location);
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
          <Loading />
          <div className="text-xs">{id}</div>
          <div>
            <StillStuck>
              <span>
                {id.indexOf("-") !== -1
                  ? "The content is being indexed, please wait..."
                  : "Are you sure it's a valid ID?"}
              </span>
            </StillStuck>
          </div>
        </div>
      )}
    </div>
  );
}
