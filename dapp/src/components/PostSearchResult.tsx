import { Post } from "services/dchan/types";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import BoardLink from "./BoardLink";
import PostComponent from "./post/Post";

export default function PostSearchResult({ post, block }: { post: Post, block?: string }) {
  const history = useHistory();
  const postLink = `/${post.id}${block ? `?block=${block}` : ""}`;
  const openPost = useCallback(() => {
    history.push(postLink);
  }, [history, postLink]);
  return (
    <div className="my-2" data-theme={post?.board?.isNsfw ? "nsfw" : "blueboard"} onDoubleClick={openPost}>
      <PostComponent
        key={post.id}
        post={post}
        block={block}
        showPostMarker={false}
        header={
          <span>
            {post.board ? <span className="p-1 whitespace-nowrap">
              [
                <BoardLink board={post.board} block={block} />
              ]
            </span> : ""}
            <span className="p-1 whitespace-nowrap">
              [
              <Link
                to={postLink}
                className="dchan-link inline"
                title="View post in thread"
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
