import { useQuery } from "@apollo/react-hooks";
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

  const [stillStuck, setStillStuck] = useState<boolean>(false);

  setTimeout(() => {
    setStillStuck(true);
  }, 5000);

  const history = useHistory();

  useEffect(() => {
    if (data) {
      let location = null;

      const {
        boardCreationEvent,
        threadCreationEvent,
        postCreationEvent,
        board,
        thread,
        post,
      } = data;

      if (boardCreationEvent) {
        const { board } = boardCreationEvent;
        if (board.name && board.id) {
          location = Router.board(board);
        }
      } else if (threadCreationEvent) {
        const { thread } = threadCreationEvent;
        if (thread.board.name && thread.board.id && thread.n) {
          location = Router.thread(thread);
        }
      } else if (postCreationEvent) {
        const { post } = postCreationEvent;
        if (post.thread.board.name && post.thread.board.id && post.thread.n) {
          location = Router.post(post);
        }
      } else if (board) {
        if (board.name && board.id) {
          location = Router.board(board);
        }
      } else if (thread) {
        if (thread.board.name && thread.board.id && thread.n) {
          location = Router.thread(thread);
        }
      } else if (post) {
        if (post.thread.board.name && post.thread.board.id && post.thread.n) {
          location = Router.post(post);
        }
      }

      if (location) {
        history.replace(location);
      }
    }
  }, [history, data]);

  return (
    <div className="bg-primary center grid w-screen h-screen">
      <div>
        <Loading />
        <div>
          {stillStuck
            ? "The content is being created, or the IDs is invalid."
            : ""}
        </div>
      </div>
    </div>
  );
}
