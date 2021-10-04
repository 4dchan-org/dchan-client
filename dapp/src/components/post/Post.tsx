import IPFSImage from "components/IPFSImage";
import { Post as DchanPost, Thread } from "dchan";
import { isLowScore } from "dchan/entities/post";
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import { truncate } from "lodash";
import { useCallback } from "react";
import { ReactElement, useEffect, useRef, useState, memo } from "react";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import { isEqual } from "lodash";
import useUser from "hooks/useUser";
import { Link } from "react-router-dom";
import useBlockNumber from "hooks/useBlockNumber";

function Post({
  children,
  post,
  thread,
  header,
  enableBacklinks = false,
  showNsfw = true
}: {
  children?: any;
  post: DchanPost;
  thread?: Thread;
  header?: ReactElement;
  enableBacklinks?: boolean;
  showNsfw?: boolean
}) {
  const { data: userData } = useUser()
  const [showAnyway, setShowAnyway] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [backlinks, setBacklinks] = useState<object>({});
  const postRef = useRef<HTMLInputElement>(null);
  const { subscribe, unsubscribe } = usePubSub();

  let {
    id,
    from: { id: address },
    n,
    image,
    bans,
  } = post;

  const onFocus = useCallback(() => {
    postRef.current?.scrollIntoView();
  }, [postRef]);

  useEffect(() => {
    const sub = subscribe("POST_FOCUS", (_: any, focusedPost: DchanPost) => {
      const newIsFocused = post.id === focusedPost.id
      setIsFocused(newIsFocused);
      setIsHighlighted(newIsFocused);
      if (newIsFocused) {
        onFocus();
      }
    });

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    const sub = subscribe("POST_HIGHLIGHT", (_: any, focusedPost: string) => {
      if (post.id === focusedPost) {
        setIsHighlighted(true);
      }
    });

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    const sub = subscribe("POST_DEHIGHLIGHT", (_: any, focusedPost: string) => {
      if (post.id === focusedPost && !isFocused) {
        setIsHighlighted(false);
      }
    });

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    if (enableBacklinks) {
      let sub = subscribe(
        "POST_BACKLINK",
        (
          _: any,
          { from, to: { n } }: { from: DchanPost; to: { n: string } }
        ) => {
          if (`${n}` === `${post.n}` && !(from.id in backlinks)) {
            //console.log(`Post ${post.n} received backlink from ${from.n}`);
            setBacklinks({ ...backlinks, [from.id]: from });
          }
        }
      )

      return () => {
        !!sub && unsubscribe(sub);
      };
    }
  });

  const ipfsUrl = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : "";
  const isOp = id === thread?.id;
  const isYou = userData?.user?.id === post.from.id 
  const [settings] = useSettings();
  const bIsLowScore = isLowScore(
    post,
    settings?.content_filter?.score_threshold
  );
  const canShow =
    !bIsLowScore ||
    settings?.content_filter?.show_below_threshold ||
    showAnyway;
  const block = useBlockNumber();

  return (
    <div className="flex">
      {!isOp ? <span className="hidden md:block pl-2 text-secondary">&gt;&gt;</span> : ""}
      <details
        className="dchan-post-expand mx-auto md:mr-3 md:ml-2 text-left inline"
        open={canShow}
        key={id}
        ref={postRef}
      >
        <summary
          className="text-left opacity-50 z-10 whitespace-nowrap max-w-95vw overflow-hidden mb-1 flex center"
          title="Hide/Show"
        >
          <PostHeader thread={thread} post={post}>
            {header}
          </PostHeader>
        </summary>
        <article
          id={`${n}`}
          className={`dchan-post text-left w-full`}
          dchan-post-from-address={address}
        >
          <div
            className={`${isHighlighted || isFocused ? "bg-tertiary" : !isOp ? "bg-secondary" : ""} ${isYou ? "border-dashed border-2 border-tertiary" : ""} w-full sm:w-auto mb-2 pr-4 inline-block relative max-w-screen-xl`}
          >
            <div className="flex sm:flex-wrap ml-5 align-center text-center sm:text-left sm:justify-start max-w-100vw">
              <PostHeader thread={thread} post={post} backlinks={backlinks}>
                {header}
              </PostHeader>

              {post.sage ? <abbr className="opacity-20 hover:opacity-100" title="Saged. Thread not bumped.">🍂</abbr> : ""}
            </div>

            {!canShow ? (
              <button
                onClick={() => setShowAnyway(true)}
                className="text-2xl text-gray-800"
              >
                <div>⚠️</div>
                <div>Post hidden due to reports.</div>
                <div className="text-sm text-gray-600">
                  Click to show anyway.
                </div>
              </button>
            ) : (
              <div>
                {!!image ? (
                  <div className="text-center sm:text-left mx-5 truncate">
                    <span className="text-sm">
                      <span className="flex flex-wrap">
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
                        {/* <span className="px-1">
                          ({Math.trunc(parseInt(image.byteSize) * 0.001)}kb)
                        </span> */}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="px-1 opacity-20 hover:opacity-100  hidden sm:inline-block"
                          href={ipfsUrl}
                          title={image.name}
                        >
                          <small>{image.ipfsHash}</small>
                        </a>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <div className="y-1">
                  <div
                    className={`h-full max-w-max flex flex-wrap text-left sm:items-start pb-1 ${
                      isOp ? `max-w-100vw` : "max-w-90vw"
                    }`}
                  >
                    <span className="w-full">
                      {!!image ? (
                        <div className="overflow-auto float-left mx-5 mb-2">
                          <IPFSImage
                            hash={image.ipfsHash}
                            isSpoiler={image.isSpoiler}
                            isNsfw={(image.isNsfw && !post.board?.isNsfw) || false}
                            thumbnail={true}
                            thumbnailClass={isOp ? "max-w-8rem max-h-32 md:max-w-16rem md:max-h-64" : undefined}
                            expandable={true}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div>
                        {isOp && thread ? (
                          <div className="font-semibold md:ml-10 ml-5 ">
                            {thread.subject}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <PostBody
                        className="md:ml-10 ml-5 mr-5 py-2 mb-2"
                        post={post}
                        thread={thread}
                      />

                      {bans.length > 0 ? (
                        <div className="text-xl font-bold text-contrast whitespace-nowrap">
                          ( USER WAS BANNED FOR THIS POST )
                        </div>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  {children}
                  <Link
                    className="px-1 text-xs opacity-10 hover:opacity-100 absolute bottom-0 right-0"
                    to={`/${post.id}${block ? `?block=${block}` : ""}`} title="Permalink">
                    <small>{post.id}</small>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </article>
      </details>
    </div>
  );
}

export default memo(Post, isEqual);
