import IPFSImage from "components/IPFSImage";
import { Post as DchanPost, Thread } from "dchan";
import { truncate } from "lodash";
import { useState } from "react";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

export default function Post({ post, thread }: { post: DchanPost; thread: Thread }) {
  const [focused, setFocused] = useState<boolean>(false);

  const onPostFocus = (_: any, focusId: string) => {
    setFocused(id == focusId);
  };

  PubSub.subscribe("POST_FOCUS", onPostFocus);

  let {
    id,
    from: { id: address },
    n,
    image,
    bans,
    comment,
  } = post;

  const ipfsUrl = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : "";
  const isOp = id === thread?.id;

  return (
    <details className="dchan-post-expand" open={true} key={id}>
      <summary className="text-left pl-2 opacity-50 z-10" title="Hide/Show">
        <PostHeader thread={thread} post={post}></PostHeader>
      </summary>
      <article
        id={`${n}`}
        className="dchan-post text-left w-full"
        dchan-post-from-address={address}
      >
        <div
          className={`${!isOp ? "bg-secondary" : ""} ${
            focused ? "bg-tertiary" : ""
          } w-full sm:w-auto pb-2 mb-2 px-4 inline-block border-bottom-invisible relative max-w-screen-xl`}
        >
          <div className="flex flex-wrap center sm:block pl-2">
            <PostHeader thread={thread} post={post}></PostHeader>
          </div>
          {!!image ? (
            <div className="text-center sm:text-left">
              <span>
                File:{" "}
                <span className="text-xs">
                  <a
                    target="_blank"
                    className="text-blue-600 max-w-64"
                    href={ipfsUrl}
                    title={image.name}
                  >
                    {truncate(image.name, {
                      length: 32,
                      omission: "...",
                    })}
                  </a>
                  {/* <a className="text-blue-600" href={ipfsUrl} download={`ipfs_${image.id}.${image.name}`}>📥</a> */}
                  <span>, {Math.trunc(image.byteSize * 0.001)}kb</span>
                  {/* <span>{image.resolution.height}x{image.resolution.width}</span> */}
                </span>
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="py-1">
            <div className="h-full max-w-max">
              {!!image ? (
                <div className="px-2 sm:float-left grid center">
                  <IPFSImage
                    hash={image.ipfsHash}
                    isSpoiler={image.isSpoiler}
                    isNsfw={image.isNsfw}
                    thumbnail={true}
                    expandable={true}
                  ></IPFSImage>
                </div>
              ) : (
                ""
              )}

              {isOp ? (
                <span className="font-semibold">{thread.subject}</span>
              ) : (
                ""
              )}

              <PostBody>{comment}</PostBody>

              {bans.length > 0 ? (
                <div className="text-xl font-bold text-contrast whitespace-nowrap">
                  ( USER WAS BANNED FOR THIS POST )
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </article>
    </details>
  );
}
