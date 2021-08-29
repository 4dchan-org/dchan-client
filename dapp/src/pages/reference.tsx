import { useQuery } from "@apollo/react-hooks";
import Error from "components/Error";
import Loading from "components/Loading";
import SEARCH_BY_ID from "dchan/graphql/queries/search";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";

export default function ReferencePage({
  match: {
    params: { id },
  },
}: any) {
  const { data } = useQuery<any, any>(SEARCH_BY_ID, {
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
        board = boardCreationEvent;
      } else if (!thread && threadCreationEvent) {
        thread = threadCreationEvent;
      } else if (!post && postCreationEvent) {
        post = postCreationEvent;
      }

      console.log({board, thread, post})
      
      if (board) {
        location = Router.board(board);
      } else if (thread) {
        location = Router.thread(thread);
      } else if (post) {
        location = Router.post(post);
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
        <Error subject={"Not found"} body={error} />
      ) : (
        <div>
          <Loading />
          <div>
            {stillStuck
              ? "Either the content is still being created, or the IDs is invalid."
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}
