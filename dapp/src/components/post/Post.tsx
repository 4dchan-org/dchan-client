import IPFSImage from "components/IPFSImage";
import { BACKLINK_REGEX, Post as DchanPost, Thread } from "dchan";
import usePubSub from "hooks/usePubSub";
import { truncate } from "lodash";
import { useEffect, useRef, useState } from "react";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

export default function Post({
  post,
  thread,
}: {
  post: DchanPost;
  thread: Thread;
}) {
  const [focused, setFocused] = useState<boolean>(false);
  const [backlinks, setBacklinks] = useState<object>({});
  const postRef = useRef<HTMLInputElement>(null);
  const { publish, subscribe } = usePubSub();

  let {
    id,
    from: { id: address },
    n,
    image,
    bans,
    comment,
    score,
  } = post;

  useEffect(() => {
    subscribe("POST_FOCUS", (_: any, n: string) => {
      setFocused(`${n}` === `${post.n}`);
    });
  }, [post, setFocused, subscribe]);

  const ipfsUrl = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : "";

  const isLowScore = score / 1_000_000_000 < 1;
  useEffect(() => {
    subscribe(
      "POST_BACKLINK",
      (_: any, { from, to: { n } }: { from: DchanPost; to: { n: string } }) => {
        `${n}` === `${post.n}` &&
          setBacklinks({ ...backlinks, [from.id]: true });
      }
    );
  }, [backlinks, setBacklinks, post, setFocused, subscribe]);
  const isOp = id === thread?.id;

  useEffect(() => {
    post.comment
      .match(BACKLINK_REGEX)
      ?.map((comment) => comment.replace(/&gt;/g, ""))
      .forEach((n) => {
        publish("POST_BACKLINK", {
          from: post,
          to: {
            n,
          },
        });
      });
  }, [post, publish]);

  return (
    <details className="dchan-post-expand" open={!isLowScore} key={id} ref={postRef}>
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
            <PostHeader
              thread={thread}
              post={post}
              backlinks={backlinks}
            ></PostHeader>
          </div>
          <div>
            {!!image ? (
              <div className="text-center sm:text-left">
                <span>
                  File:{" "}
                  <span className="text-xs">
                    <a
                      target="_blank"
                      rel="noreferrer"
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
              <div className="h-full max-w-max flex">
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

                <span>
                  <div>
                    {isOp ? (
                      <span className="font-semibold">{thread.subject}</span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <PostBody>{comment}</PostBody>
                  </div>

                  {bans.length > 0 ? (
                    <div className="text-xl font-bold text-contrast whitespace-nowrap">
                      ( USER WAS BANNED FOR THIS POST )
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          </div>{" "}
        </div>
      </article>
    </details>
  );
}
