import { useQuery } from "@apollo/react-hooks";
import Loading from "components/Loading";
import SEARCH_BY_ID from "dchan/graphql/queries/search";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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

      const { boardCreationEvent, threadCreationEvent, postCreationEvent } =
        data;

      if (boardCreationEvent) {
        const { board } = boardCreationEvent;
        if (board.name && board.id) {
          location = `/${board.name}/${board.id}`;
        }
      } else if (threadCreationEvent) {
        const { thread } = threadCreationEvent;
        if (thread.board.name && thread.board.id && thread.n) {
          location = `/${thread.board.name}/${thread.board.id}/${thread.n}`;
        }
      } else if (postCreationEvent) {
        const { post } = postCreationEvent;
        if (post.thread.board.name && post.thread.board.id && post.thread.n) {
          location = `/${post.thread.board.name}/${post.thread.board.id}/${post.thread.n}/${post.n}`;
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
