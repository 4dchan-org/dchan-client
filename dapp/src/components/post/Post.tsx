import IPFSImage from "components/IPFSImage";
import { Post as DchanPost, Thread } from "dchan";
import { isLowScore } from "dchan/entities/post";
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import { useCallback } from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Router } from "router";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import sanitize from "sanitize-html";
import useFavorites from "hooks/useFavorites";
import { isArray } from "lodash";

export default function Post({
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
  const history = useHistory();
  const [showAnyway, setShowAnyway] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
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
    setIsFocused(true);
    postRef.current?.scrollIntoView();
    const url = Router.post(post);
    url && history.push(url);
  }, [post, postRef, history, setIsFocused]);

  useEffect(() => {
    const sub = subscribe("POST_FOCUS", (_: any, focusedPost: DchanPost | DchanPost[]) => {
      const newIsFocused = isArray(focusedPost) ? !!focusedPost.find(p => post.id === p.id) : post.id === focusedPost.id
      setIsFocused(newIsFocused);
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
        setIsFocused(true);
      }
    });

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    const sub = subscribe("POST_DEHIGHLIGHT", (_: any, focusedPost: string) => {
      if (post.id === focusedPost) {
        setIsFocused(false);
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
          if (`${n}` === `${post.n}`) {
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
    <div className="flex">
      {!isOp ? <span className="md:pl-2 pl-1 text-secondary">&gt;&gt;</span> : ""}
      <details
        className="dchan-post-expand mr-3 text-left inline md:pl-2 pl-1"
        open={canShow}
        key={id}
        ref={postRef}
      >
        <summary
          className="text-left opacity-50 z-10 whitespace-nowrap overflow-hidden mb-1"
          title="Hide/Show"
        >
          <PostHeader thread={thread} post={post}>
            {header}
          </PostHeader>
        </summary>
        <article
          id={`${n}`}
          className="dchan-post text-left w-full"
          dchan-post-from-address={address}
        >
          <div
            className={`${!isOp ? "bg-secondary max-w-90vw mb-2" : "max-w-100vw -ml-1 mb-1"} ${
              isFocused ? "bg-tertiary" : ""
            } inline-block border-bottom-invisible relative`}
          >
            <div className="flex flex-wrap ml-5 center text-center sm:text-left sm:block max-w-100vw">
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
                  <div className="text-left text-sm mx-5 truncate">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 max-w-64"
                      href={ipfsUrl}
                      title={image.name}
                    >
                      <u>
                        {image.name}
                      </u>
                    </a>
                    <span className="px-1">
                      ({Math.trunc(parseInt(image.byteSize) * 0.001)}kb)
                    </span>
                    <span className="px-1 text-gray-400 hover:text-gray-600">
                      <small>
                        {image.ipfsHash}
                      </small>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <div
                    className={`h-full sm:flex-nowrap text-left sm:items-start max-w-90vw ${
                      isOp ? `pb-2` : ""
                    }`}
                  >
                    <span>
                      {!!image ? (
                        <div className="overflow-auto float-left mx-5 mb-2 grid center flex-shrink-0 max-w-100vw sm:max-w-max">
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
                      <div>
                        {isOp && thread ? (
                          <div className="font-semibold mx-5">
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
