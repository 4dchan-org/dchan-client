import IPFSImage from "components/IPFSImage";
import { BACKLINK_REGEX } from "dchan/regexps";
import { Post as DchanPost, Thread } from "dchan";
import { isLowScore } from "dchan/entities/post";
import usePubSub from "hooks/usePubSub";
import useSettings from "hooks/useSettings";
import { truncate } from "lodash";
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
  const { publish, subscribe, unsubscribe } = usePubSub();

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
    let sub = enableBacklinks
      ? subscribe(
          "POST_BACKLINK",
          (
            _: any,
            { from, to: { n } }: { from: DchanPost; to: { n: string } }
          ) => {
            `${n}` === `${post.n}` &&
              setBacklinks({ ...backlinks, [from.id]: from });
          }
        )
      : false;

    return () => {
      !!sub && unsubscribe(sub);
    };
  });

  useEffect(() => {
    post.comment
      .match(BACKLINK_REGEX)
      ?.map((comment) => {
        return comment.replace(/>/g, "");
      })
      .forEach((blMatch) => {
        const [userId, n] = blMatch.split("/")
        const backlink = {
          from: post,
          to: {
            userId: userId.trim(),
            n: n.trim(),
          },
        };

        publish("POST_BACKLINK", backlink);
      });
  }, [post, publish]);

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
          className="text-left opacity-50 z-10 whitespace-nowrap overflow-hidden"
          title="Hide/Show"
        >
          <div className="inline">
            <PostHeader thread={thread} post={post}>
              {header}
            </PostHeader>
          </div>
        </summary>
        <article
          id={`${n}`}
          className="dchan-post text-left w-full"
          dchan-post-from-address={address}
        >
          <div
            className={`${!isOp ? "bg-secondary max-w-90vw" : "max-w-100vw -ml-1"} ${
              isFocused ? "bg-tertiary" : ""
            } pb-2 my-1 px-4 inline-block border-bottom-invisible relative`}
          >
            <div className="flex sm:flex-wrap center text-center sm:text-left sm:block max-w-100vw">
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
                  <div className="text-left text-sm truncate">
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
                      <small>
                        {image.ipfsHash}
                      </small>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <div className="y-1 pt-2 pb-2">
                  <div
                    className={`h-full sm:flex-nowrap text-left sm:items-start max-w-90vw ${
                      isOp ? `pb-2` : ""
                    }`}
                  >
                    <span>
                      {!!image ? (
                        <div className="overflow-auto pr-5 float-left grid center flex-shrink-0 max-w-100vw sm:max-w-max">
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
                          <span className="font-semibold">
                            {thread.subject}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <PostBody
                        style={{marginLeft: "1.25rem"}}
                        post={post}
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
