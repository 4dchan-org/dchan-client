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
import sanitize from "sanitize-html";
import useFavorites from "hooks/useFavorites";
import { isEqual } from "lodash";

function Post({
  children,
  post,
  thread,
  header,
  enableBacklinks = false,
}: {
  children?: any;
  post: DchanPost;
  thread?: Thread;
  header?: ReactElement;
  enableBacklinks?: boolean;
}) {
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
    comment,
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
  const [settings] = useSettings();
  const bIsLowScore = isLowScore(
    post,
    settings?.content_filter?.score_threshold
  );
  const canShow =
    !bIsLowScore ||
    settings?.content_filter?.show_below_threshold ||
    showAnyway;

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = thread && isFavorite ? isFavorite(thread) : false;

  const onFavorite = useCallback(() => {
    if (thread && removeFavorite && addFavorite) {
      if (favorite) {
        removeFavorite(thread);
      } else {
        addFavorite(thread);
      }
    }
  }, [addFavorite, removeFavorite, thread, favorite]);
  return (
    <div className="flex max-w-100vw">
      {!isOp ? <span className="hidden sm:block pl-2 text-secondary">&gt;&gt;</span> : ""}
      <details
        className="dchan-post-expand sm:mx-2 text-left inline"
        open={canShow}
        key={id}
        ref={postRef}
      >
        <summary
          className="text-left opacity-50 z-10 whitespace-nowrap max-w-95vw overflow-hidden"
          title="Hide/Show"
        >
          <PostHeader thread={thread} post={post}>
            {header}
          </PostHeader>
          <span>
            {sanitize(thread?.subject || comment, { allowedTags: [] })}
          </span>
        </summary>
        <article
          id={`${n}`}
          className="dchan-post text-left w-full"
          dchan-post-from-address={address}
        >
          <div
            className={`${!isOp ? "bg-secondary" : ""} ${
              isHighlighted ? "bg-tertiary" : ""
            } w-full sm:w-auto pb-2 mb-2 px-4 inline-block border-bottom-invisible relative max-w-screen-xl`}
          >
            <div className="flex sm:flex-wrap center text-center sm:text-left sm:block max-w-90vw">
              {isOp && thread ? (
                <button
                  className={`inline-block ${
                    favorite
                      ? "opacity-60 hover:opacity-80"
                      : "opacity-20 hover:opacity-40"}`
                  }
                  title={favorite ? "Remove from favorites" : "Add to favorites"}
                  onClick={onFavorite}
                >
                  ⭐
                </button>
              ) : (
                <span></span>
              )}

              <PostHeader thread={thread} post={post} backlinks={backlinks}>
                {header}
              </PostHeader>
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
                  <div className="text-center sm:text-left">
                    <span className="text-sm">
                      <span>
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
                        <span className="px-1">
                          ({Math.trunc(parseInt(image.byteSize) * 0.001)}kb)
                        </span>
                        <span className="px-1 text-gray-400 hover:text-gray-600">
                          <small>{image.ipfsHash}</small>
                        </span>
                      </span>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <div className="y-1">
                  <div
                    className={`h-full max-w-max flex flex-wrap text-left sm:items-start ${
                      isOp ? `pb-2` : ""
                    }`}
                  >
                    {!!image ? (
                      <IPFSImage
                        hash={image.ipfsHash}
                        isSpoiler={image.isSpoiler}
                        isNsfw={image.isNsfw}
                        thumbnail={true}
                        expandable={true}
                      ></IPFSImage>
                    ) : (
                      ""
                    )}

                    <span className="px-2">
                      <div>
                        {isOp && thread ? (
                          <span className="font-semibold">
                            {thread.subject}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <PostBody post={post} thread={thread}/>
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
                  {children}
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
