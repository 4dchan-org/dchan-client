import { useQuery } from "@apollo/react-hooks";
import { Error, Loading, StillStuck } from "src/components";
import {
  Board,
  BoardRef,
  Post,
  PostRef,
  Thread,
  ThreadRef,
} from "src/subgraph/types";
import {
  SEARCH_BY_ID,
  SEARCH_BY_ID_BLOCK,
} from "src/subgraph/graphql/queries";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Router } from "src/router";
import { useTimeTravel } from "src/hooks";

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

export const IdReferencePage = () => {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const { id } = useParams();

  const { timeTraveledToBlockNumber: block } = useTimeTravel();

  const graphQuery = block ? SEARCH_BY_ID_BLOCK : SEARCH_BY_ID;

  const { data } = useQuery<IdSearchData, IdSearchVars>(graphQuery, {
    variables: { id: id || "", block },
    fetchPolicy: "cache-and-network",
    pollInterval: 10_000,
  });

  useEffect(() => {
    if (data) {
      let location = null;

      const { boardRef, threadRef, postRef } = data;
      let { board, thread, post } = data;

      if (!board && boardRef) {
        board = boardRef.board;
      } else if (!thread && threadRef) {
        thread = threadRef.thread;
      } else if (!post && postRef) {
        post = postRef.post;
      }

      const blockUrl = block ? `?block=${block}` : "";

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
        navigate(location, { replace: true });
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
          <Loading />
          <div className="text-xs dchan-link">{id}</div>
          <div>
            <StillStuck>
              <span>
                {id?.indexOf("0x") === 0
                  ? "The content is being indexed, please wait..."
                  : "Are you sure it's a valid ID?"}
              </span>
            </StillStuck>
          </div>
        </div>
      )}
    </div>
  );
};
