import { Post } from "dchan";
import { Link } from "react-router-dom";
import IdLabel from "./IdLabel";
import PostComponent from "./post/Post";

export default function PostSearchResult({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap my-2">
      <PostComponent
        key={post.id}
        post={post}
        header={
          <span>
            <span className="p-1 whitespace-nowrap">
              [
              <span className="p-1">
                <Link
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500 inline"
                  to={`/${post.board?.name}/${post.board?.id}`}
                >
                  /{post.board?.name}/
                  <IdLabel id={post.board?.id || "0x000000"}></IdLabel>
                </Link>
              </span>
              ]
            </span>
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
