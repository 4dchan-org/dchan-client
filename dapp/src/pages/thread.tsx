import { Thread } from "dchan";
import Footer from "components/Footer";
import BoardHeader from "components/board/header";
import FormPost from "components/form/post";
import { useQuery } from "@apollo/react-hooks";
import THREAD_GET from "dchan/graphql/queries/threads/get";
import Loading from "components/Loading";
import useWeb3 from "hooks/useWeb3";
import { useState } from "react";
import Error from "components/Error";
import { HashLink } from "react-router-hash-link";
import Post from "components/post/Post";

interface ThreadData {
  thread?: Thread;
}
interface ThreadVars {
  threadId: string;
}

export default function ThreadPage({
  match: {
    params: { threadId },
  },
}: any) {
  const { loading, data, error } = useQuery<ThreadData, ThreadVars>(
    THREAD_GET,
    {
      variables: { threadId: `0x${threadId}` },
      pollInterval: 10000,
    }
  );
  const thread = data?.thread;

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
            <Post post={post} thread={thread} />
          ))}
          <div>
            <HashLink
              to="#board-header"
              className="inline bg-secondary rounded-full"
            >
              ⤴️
            </HashLink>
          </div>
        </div>
      ) : (
        ""
      )}

      <Footer></Footer>
    </div>
  );
}
