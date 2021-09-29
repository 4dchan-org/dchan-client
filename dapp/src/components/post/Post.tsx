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
import useUser from "hooks/useUser";

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
  console.log({userData, post})
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
          className="text-left opacity-50 z-10 whitespace-nowrap max-w-95vw overflow-hidden mb-1"
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
          className={`dchan-post text-left w-full`}
          dchan-post-from-address={address}
        >
          <div
            className={`${isHighlighted || isFocused ? "bg-tertiary" : !isOp ? "bg-secondary" : ""} ${userData?.user?.id === post.from.id ? "border-dashed border-2 border-tertiary" : ""} w-full sm:w-auto mb-2 pr-4 inline-block relative max-w-screen-xl`}
          >
            <div className="flex sm:flex-wrap ml-5 center text-center sm:text-left sm:block max-w-100vw">
              {isOp && thread ? (
                <button
                  className={`inline-block ${
                    favorite
                      ? "opacity-60 hover:opacity-80"
                      : "opacity-20 hover:opacity-40"}`
                  }
                  title={favorite ? "Remove from watched" : "Add to watched"}
                  onClick={onFavorite}
                >
                  👁
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
                  <div className="text-center sm:text-left mx-5 truncate">
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
                      isOp ? `max-w-100vw pb-2` : "max-w-90vw"
                    }`}
                  >

                    <span className="w-full">
                      {!!image ? (
                        <div className="overflow-auto float-left mx-5 mb-2">
                          <IPFSImage
                            hash={image.ipfsHash}
                            isSpoiler={image.isSpoiler}
                            isNsfw={image.isNsfw}
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
