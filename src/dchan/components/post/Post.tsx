import { PostBody, PostHeader } from ".";
import { IPFSImage, Menu, Twemoji } from "dchan/components";
import { Post as DchanPost, Thread } from "dchan/subgraph/types";
import { isLowScore } from "dchan/subgraph/entities/post";
import { usePubSub, useSettings, useUser, useTimeTravel } from "dchan/hooks";
import { truncate, isEqual } from "lodash";
import {
  ReactElement,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import prettyBytes from "pretty-bytes";

export const Post = memo(
  ({
    children,
    post,
    thread,
    header,
    enableBacklinks = false,
    showNsfw = false,
    showPostMarker = true,
  }: {
    children?: any;
    post: DchanPost;
    thread?: Thread;
    header?: ReactElement;
    enableBacklinks?: boolean;
    showNsfw?: boolean;
    showPostMarker?: boolean;
  }) => {
    let {
      id,
      from: { id: address },
      n,
      image,
      bans,
    } = post;
    const { timeTraveledToBlockNumber: block } = useTimeTravel();
    const { data: selfUserData } = useUser();
    const [imgContentLength, setImgContentLength] = useState<
      number | undefined
    >();
    const [showAnyway, setShowAnyway] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [backlinks, setBacklinks] = useState<object>({});
    const postRef = useRef<HTMLInputElement>(null);
    const { subscribe, unsubscribe } = usePubSub();

    const onFocus = useCallback(() => {
      postRef.current?.scrollIntoView();
    }, [postRef]);

    useEffect(() => {
      const sub = subscribe("POST_FOCUS", (_: any, focusedPost: DchanPost) => {
        const newIsFocused = post.id === focusedPost.id;
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
      const sub = subscribe(
        "POST_DEHIGHLIGHT",
        (_: any, focusedPost: string) => {
          if (post.id === focusedPost && !isFocused) {
            setIsHighlighted(false);
          }
        }
      );

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
        );

        return () => {
          !!sub && unsubscribe(sub);
        };
      }
    });

    const ipfsSrc = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : "";
    const isOp = id === thread?.id;
    const isYou = selfUserData?.user?.id === post.from.id;
    const [settings] = useSettings();
    const bIsLowScore = isLowScore(
      post,
      settings?.content_filter?.score_threshold
    );
    const canShow =
      !bIsLowScore ||
      settings?.content_filter?.show_below_threshold ||
      showAnyway;
    const toggleRef = useRef<HTMLDetailsElement>(null);
    const [showBody, setShowBody] = useState<boolean>(canShow);
    useEffect(() => {
      if (toggleRef.current) {
        setShowBody(toggleRef.current.open);
      }
    }, [toggleRef, setShowBody]);

    useEffect(() => {
      fetch(ipfsSrc, { method: "HEAD" }).then((response) =>
        setImgContentLength(Number(response.headers.get("Content-Length")))
      );
    }, [ipfsSrc, setImgContentLength]);

    const bodyClass = [
      isHighlighted || isFocused
        ? "bg-tertiary border-bottom-secondary-accent"
        : !isOp
        ? "bg-secondary border-bottom-tertiary-accent border-right-tertiary-accent"
        : "",
      isYou ? "dchan-post-you" : "",
      "w-full sm:w-full my-2 inline-block relative",
    ].join(" ");

    return (
      <div className="flex relative ">
        {!isOp && showPostMarker ? (
          <span className="hidden md:block pl-2 text-secondary">&gt;&gt;</span>
        ) : (
          ""
        )}
        <div
          className={`mx-auto md:mr-3 md:ml-2 text-left inline w-screen md:w-auto ${
            isOp ? "w-full" : ""
          }`}
          key={id}
          ref={postRef}
        >
          <details
            className="absolute ml-2 z-10 dchan-post-minimizer opacity-70 hover:opacity-100"
            ref={toggleRef}
            open={canShow}
            onToggle={(e: any) => {
              setShowBody(e.target.open);
            }}
          >
            <summary />
          </details>
          <div
            className={`text-left opacity-50 whitespace-nowrap mb-1 mt-2 overflow-hidden flex ml-5 ${
              showBody ? "hidden" : ""
            }`}
            title="Hide/Show"
          >
            <PostHeader thread={thread} post={post}>
              {header}
            </PostHeader>
          </div>
          <div
            id={`${n}`}
            className={`dchan-post text-left w-full ${
              !showBody ? "hidden" : ""
            }`}
            dchan-post-from-address={address}
          >
            <div className={bodyClass}>
              <div className="flex sm:flex-wrap ml-5 align-center text-center sm:text-left sm:justify-start max-w-100vw">
                <PostHeader thread={thread} post={post} backlinks={backlinks}>
                  {header}
                </PostHeader>

                {post.sage ? (
                  <abbr
                    className="opacity-20 hover:opacity-100"
                    title="Saged. Thread not bumped."
                  >
                    🍂
                  </abbr>
                ) : (
                  ""
                )}
              </div>

              {!canShow ? (
                <button
                  onClick={() => setShowAnyway(true)}
                  className="text-2xl text-gray-800"
                >
                  <div>
                    <Twemoji emoji={"⚠️"} />
                  </div>
                  <div>Post hidden due to reports.</div>
                  <div className="text-sm text-gray-600">
                    Click to show anyway.
                  </div>
                </button>
              ) : (
                <div>
                  {!!image ? (
                    <div className="text-center sm:text-left mx-5">
                      <span className="text-sm">
                        <span className="flex flex-wrap items-center">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            className="dchan-link underline max-w-64"
                            href={ipfsSrc}
                            title={image.name}
                          >
                            {truncate(image.name, {
                              length: 32,
                              omission: "...",
                            })}
                          </a>
                          {imgContentLength ? (
                            <span className="mx-1 text-xs opacity-40 hover:opacity-100">
                              ({prettyBytes(imgContentLength)})
                            </span>
                          ) : (
                            <></>
                          )}
                          <Menu>
                            <div>
                              Reverse search:
                              <div>
                                <div>
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dchan-link pr-1"
                                    href={`https://yandex.com/images/search?rpt=imageview&url=${ipfsSrc}`}
                                  >
                                    yandex
                                  </a>
                                </div>
                                <div>
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dchan-link pr-1"
                                    href={`//iqdb.org/?url=${ipfsSrc}`}
                                  >
                                    iqdb
                                  </a>
                                </div>
                                <div>
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dchan-link pr-1"
                                    href={`https://trace.moe/?auto&url=${ipfsSrc}`}
                                  >
                                    wait
                                  </a>
                                </div>
                              </div>
                            </div>
                          </Menu>
                          <span className="whitespace-nowrap">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="px-1 opacity-20 hover:opacity-100 hidden sm:inline-block"
                              href={ipfsSrc}
                              title={image.name}
                            >
                              <small>{image.ipfsHash}</small>
                            </a>
                          </span>
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
                      <div className="w-full">
                        {!!image ? (
                          <div className="overflow-hidden float-left mx-5 mb-2">
                            <IPFSImage
                              hash={image.ipfsHash}
                              isSpoiler={image.isSpoiler}
                              isNsfw={
                                (!showNsfw &&
                                  (image.isNsfw || post.board?.isNsfw)) ||
                                false
                              }
                              thumbnail={true}
                              thumbnailClass={
                                isOp
                                  ? "max-w-8rem max-h-32 md:max-w-16rem md:max-h-64"
                                  : undefined
                              }
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
                          className="md:ml-10 ml-5 mr-5 py-2"
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
                      </div>
                    </div>
                    {children}
                    <Link
                      className="px-1 text-xs opacity-5 hover:opacity-100 absolute bottom-0 right-0 hidden sm:inline"
                      to={`/${post.id}${block ? `?block=${block}` : ""}`}
                      title="Permalink"
                    >
                      <small>{post.id}</small>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  isEqual
);
