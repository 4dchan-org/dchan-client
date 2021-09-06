import { useQuery } from "@apollo/react-hooks";
import Error from "components/Error";
import Loading from "components/Loading";
import {
  Board,
  BoardCreationEvent,
  Post,
  PostCreationEvent,
  Thread,
  ThreadCreationEvent,
} from "dchan";
import SEARCH_BY_ID from "graphql/queries/search_by_id";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";

interface SearchData {
  boardCreationEvent: BoardCreationEvent;
  threadCreationEvent: ThreadCreationEvent;
  postCreationEvent: PostCreationEvent;
  board: Board;
  thread: Thread;
  post: Post;
}
interface SearchVars {
  id: string;
}

export default function ReferencePage({
  match: {
    params: { id },
  },
}: any) {
  const { data } = useQuery<SearchData, SearchVars>(SEARCH_BY_ID, {
    variables: { id: `0x${id}` },
    pollInterval: 5_000,
  });

  const [error, setError] = useState<string>();
  const [stillStuck, setStillStuck] = useState<boolean>(false);

  setTimeout(() => {
    setStillStuck(true);
  }, 10_000);

  const history = useHistory();

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

      if (board) {
        location = `${Router.board(board)}`;
      } else if (thread) {
        location = `${Router.thread(thread)}`;
      } else if (post) {
        location = `${Router.post(post)}`;
      }

      if ((board || thread || post) && !location) {
        setError("Content missing.");
      }

      if (location) {
        history.replace(location);
      }
    }
  }, [history, data]);

  return (
    <div className="bg-primary center grid w-screen h-screen">
      {error ? (
        <Error subject={"Not found"}>
          <span>{error}</span>
        </Error>
      ) : (
        <div>
          <Loading />
          <div className="text-xs">{`0x${id}`}</div>
          <div>
            {stillStuck
              ? id.indexOf("-") !== -1
                ? "The requested content is (probably) still being indexed, please wait..."
                : "Are you sure it's a valid ID?"
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}
