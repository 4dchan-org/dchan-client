import { useQuery } from "@apollo/react-hooks";
import Error from "components/Error";
import Loading from "components/Loading";
import StillStuck from "components/StillStuck";
import {
  Board,
  BoardCreationEvent,
  Post,
  PostCreationEvent,
  Thread,
  ThreadCreationEvent,
} from "dchan";
import SEARCH_BY_ID from "graphql/queries/search_by_id";
import SEARCH_BY_ID_BLOCK from "graphql/queries/search_by_id_block";
import useBlockNumber from "hooks/useBlockNumber";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";

interface IdSearchData {
  boardCreationEvent: BoardCreationEvent;
  threadCreationEvent: ThreadCreationEvent;
  postCreationEvent: PostCreationEvent;
  board: Board;
  thread: Thread;
  post: Post;
}
interface IdSearchVars {
  id: string;
  block?: number;
}

export default function IdReferencePage({ location, match: { params } }: any) {
  const [error, setError] = useState<string>();
  const history = useHistory();

  const id = `0x${params.id}`;
  const queriedBlock = useBlockNumber();

  console.log({ id, queriedBlock })

  const graphQuery = queriedBlock ? SEARCH_BY_ID_BLOCK : SEARCH_BY_ID;

  const { data } = useQuery<IdSearchData, IdSearchVars>(graphQuery, {
    variables: { id, block: queriedBlock ? queriedBlock : undefined },
    pollInterval: 5_000,
  });

  useEffect(() => {
    if (data) {
      let location = null;

      let {
        boardCreationEvent,
        threadCreationEvent,
        postCreationEvent,
        board,
        thread,
        post,
      } = data;

      if (!board && boardCreationEvent) {
        board = boardCreationEvent.board;
      } else if (!thread && threadCreationEvent) {
        thread = threadCreationEvent.thread;
      } else if (!post && postCreationEvent) {
        post = postCreationEvent.post;
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
            <StillStuck><span>{id.indexOf("-") !== -1
              ? "The requested content is (probably) still being indexed, please wait..."
              : "Are you sure it's a valid ID?"}</span></StillStuck>
          </div>
        </div>
      )}
    </div>
  );
}
