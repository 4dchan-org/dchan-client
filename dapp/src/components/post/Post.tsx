import IPFSImage from "components/IPFSImage";
import { BACKLINK_REGEX, Post as DchanPost, Thread } from "dchan";
import { isLowScore } from "dchan/entities/post";
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import { truncate } from "lodash";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

export default function Post({
  post,
  thread,
  header,
}: {
  post: DchanPost;
  thread?: Thread;
  header?: ReactElement;
}) {
  const history = useHistory()
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
    comment
  } = post;

  useEffect(() => {
    subscribe("POST_FOCUS", (_: any, n: string) => {
      const isFocused = `${n}` === `${post.n}`;
      setFocused(isFocused);
      if (isFocused) {
        postRef.current?.scrollIntoView();
        const url = Router.post(post)
        url && history.replace(url)
      }
    });
  }, [post, postRef, setFocused, subscribe, history]);

  const ipfsUrl = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : "";

  useEffect(() => {
    subscribe(
      "POST_BACKLINK",
      (_: any, { from, to: { n } }: { from: DchanPost; to: { n: string } }) => {
        `${n}` === `${post.n}` &&
          setBacklinks({ ...backlinks, [from.id]: from });
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
  const [settings] = useSettings();
  const canShow = !isLowScore(post, settings?.content?.score_threshold) || settings?.content?.show_below_threshold;

  return (
    <details
      className="dchan-post-expand"
      open={canShow}
      key={id}
      ref={postRef}
    >
      <summary className="text-left pl-2 opacity-50 z-10" title="Hide/Show">
        <PostHeader thread={thread} post={post}>
          {header}
        </PostHeader>
      </summary>
      <article
        id={`${n}`}
        className="dchan-post text-left w-full mx-2"
        dchan-post-from-address={address}
      >
        <div
          className={`${!isOp ? "bg-secondary" : ""} ${
            focused ? "bg-tertiary" : ""
          } w-full sm:w-auto pb-2 mb-2 px-4 inline-block border-bottom-invisible relative max-w-screen-xl`}
        >
          <div className="flex flex-wrap center text-center sm:text-left sm:block pl-2">
            <PostHeader thread={thread} post={post} backlinks={backlinks}>
              {header}
            </PostHeader>
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
                    <span>
                      , {Math.trunc(parseInt(image.byteSize) * 0.001)}kb
                    </span>
                    {/* <span>{image.resolution.height}x{image.resolution.width}</span> */}
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="py-1">
              <div className="h-full max-w-max flex flex-wrap text-left sm:items-start">
                {!!image ? (
                  <div className="px-2 sm:float-left grid center flex-shrink-0 max-w-100vw sm:max-w-max">
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
                    {isOp && thread ? (
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
