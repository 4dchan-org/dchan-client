import { Thread } from "dchan";
import Footer from "components/Footer";
import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import { useQuery } from "@apollo/react-hooks";
import THREAD_GET from "dchan/graphql/queries/threads/get";
import Loading from "components/Loading";
import Error from "components/Error";
import { HashLink } from "react-router-hash-link";
import Post from "components/post/Post";
import { useEffect } from "react";
import usePubSub from "hooks/usePubSub";

interface ThreadData {
  thread?: Thread;
}
interface ThreadVars {
  threadId: string;
}

export default function ThreadPage({
  match: {
    params
  },
}: any) {
  const {
    threadId
  } = params
  const { loading, data, error } = useQuery<ThreadData, ThreadVars>(
    THREAD_GET,
    {
      variables: { threadId: `0x${threadId}` },
      pollInterval: 10000,
    }
  );
  const thread = data?.thread;

  const {publish} = usePubSub()
  useEffect(() => {
    if(!!data && params && params.postN) {
      publish('POST_FOCUS', params.postN)
    }
  }, [data, params, publish])

  return !loading && !thread ? (
    error ? (
      <Error subject={"Error"} body={error.message} />
    ) : (
      <Error subject={"Thread not found"} body={"¯\\_(ツ)_/¯"} />
    )
  ) : (
    <div
      className="bg-primary min-h-100vh"
      dchan-board={thread?.board.name}
      data-theme={thread?.board?.isNsfw ? "nsfw" : "blueboard"}
    >
      <BoardHeader board={thread?.board}></BoardHeader>
      <FormPost thread={thread}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      {loading ? (
        <Loading></Loading>
      ) : thread ? (
        <div className="font-size-090rem mx-2 sm:mx-4">
          {[thread.op, ...thread.replies].map((post) => (
            <Post post={post} thread={thread} key={post.id} />
          ))}
          <div className="flex center">
            [<HashLink
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              to="#board-header"
            >
              Top
            </HashLink>]
          </div>
        </div>
      ) : (
        ""
      )}

      <Footer></Footer>
    </div>
  );
}
