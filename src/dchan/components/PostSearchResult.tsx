import useTimeTravel from "dchan/hooks/useTimeTravel";
import { Post } from "dchan/subgraph/types";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { BoardLink, Post as PostComponent } from ".";

export const PostSearchResult = ({ post }: { post: Post }) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const history = useHistory();
  const postLink = `/${post.id}${block ? `?block=${block}` : ""}`;
  const openPost = useCallback(() => {
    history.push(postLink);
  }, [history, postLink]);
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
