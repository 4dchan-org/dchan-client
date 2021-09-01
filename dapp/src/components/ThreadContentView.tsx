import { Thread } from "dchan";
import PostComponent from "./post/Post";

export default function ThreadContentView({ thread }: { thread: Thread }) {
  return (
    <div>
      {[thread.op, ...thread.replies].map((post) => (
        <PostComponent post={post} thread={thread} key={post.id} />
      ))}
    </div>
  );
}
