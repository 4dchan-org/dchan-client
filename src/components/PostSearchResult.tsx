import { Post } from "src/subgraph/types";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BoardLink, Post as PostComponent } from ".";
import { useTimeTravel } from "src/hooks";

export const PostSearchResult = ({ post }: { post: Post }) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const navigate = useNavigate();
  const postLink = `/${post.id}${block ? `?block=${block}` : ""}`;
  const openPost = useCallback(() => {
    navigate(postLink);
  }, [navigate, postLink]);

  return (
    <div data-theme={post?.board?.isNsfw ? "nsfw" : "blueboard"} onDoubleClick={openPost}>
      <PostComponent
        key={post.id}
        post={post}
        showPostMarker={false}
        header={
          <span>
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
            {post.board ? <span className="whitespace-nowrap">
              <BoardLink board={post.board} />
            </span> : ""}
          </span>
        }
      />
    </div>
  );
}
