import { Post } from "dchan";
import { Link } from "react-router-dom";
import BoardLink from "./BoardLink";
import PostComponent from "./post/Post";

export default function PostSearchResult({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap my-2">
      <PostComponent
        showNsfw={false}
        key={post.id}
        post={post}
        header={
          <span>
            {post.board ? <span className="p-1 whitespace-nowrap">
              [
                <BoardLink board={post.board} />
              ]
            </span> : ""}
            <span className="p-1 whitespace-nowrap">
              [
              <Link
                to={`/${post.id}`}
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500 inline"
              >
                View
              </Link>
              ]
            </span>
          </span>
        }
      />
    </div>
  );
}
