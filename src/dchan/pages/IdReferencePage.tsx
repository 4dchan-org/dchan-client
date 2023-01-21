import { useQuery } from "@apollo/react-hooks";
import { Error, Loading, StillStuck } from "dchan/components";
import { Board, BoardRef, Post, PostRef, Thread, ThreadRef } from "dchan/subgraph/types";
import { SEARCH_BY_ID, SEARCH_BY_ID_BLOCK } from "dchan/subgraph/graphql/queries";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import useTimeTravel from "dchan/hooks/useTimeTravel";

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
  const { timeTraveledToBlockNumber: block } = useTimeTravel()

  const graphQuery = block ? SEARCH_BY_ID_BLOCK : SEARCH_BY_ID;

  const { data } = useQuery<IdSearchData, IdSearchVars>(graphQuery, {
    variables: { id, block },
    fetchPolicy: "cache-and-network",
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

      let blockUrl = block ? `?block=${block}` : "";

      if (board) {
        location = `${Router.board(board)}${blockUrl}`;
      } else if (thread) {
        location = `${Router.thread(thread)}${blockUrl}`;
      } else if (post) {
        location = `${Router.post(post)}${blockUrl}`;
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
  }, [history, data, block]);

  return (
    <div className="bg-primary center grid w-screen h-screen">
      {error ? (
        <Error subject={"Not found"}>
          <span>{error}</span>
        </Error>
      ) : (
        <div>
          <Loading />
          <div className="text-xs dchan-link">{id}</div>
          <div>
            <StillStuck>
              <span>
                {id.indexOf("0x") === 0
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
