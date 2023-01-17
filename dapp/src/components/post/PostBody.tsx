
import { shortenAddress } from "services";
import { Post, Thread } from "dchan/subgraph/types";
import {
  ParserResult,
  PostReferenceValue,
  parseComment
} from "dchan/postparser";
import { ReactElement, useCallback, useEffect, useMemo, memo, useState } from "react";
import { usePubSub, useWeb3 } from "hooks";
import { isEqual } from "lodash";
import { Router } from "router";
import { Link } from "react-router-dom";

export const TextQuote = ({
  children,
  post,
  thread,
  block,
}: {
  children: ParserResult[];
  post: Post;
  thread?: Thread;
  block?: string;
}) => {
  return (
    <span className="text-quote">
      &gt;{children.map((v) => renderValue(v, post, thread, block))}
    </span>
  );
}

function Reference({
  link,
  children,
}: {
  link: string;
  children: string | string[];
}) {
  return (
    <Link className="dchan-postref dchan-link" to={link}>
      <wbr />
      <span>&gt;&gt;{children}</span>
    </Link>
  );
}

function TxHashReference({
  id,
  children,
}: {
  id: string;
  children: string | string[];
}) {
  return (
    <Link className="dchan-link" to={`https://polygonscan.com/tx/${id}`}>
      <wbr />
      <span>{children}</span>
    </Link>
  );
}

function PostReference({
  post,
  thread,
  value,
  block,
}: {
  post: Post;
  thread?: Thread;
  value: PostReferenceValue;
  block?: string;
}) {
  const { publish } = usePubSub();
  const postLink = value.id ? `${value.id}/${value.n}` : value.n;

  const refPost = useMemo(
    () =>
      thread &&
      [thread.op, ...(thread.replies || [])].find(
        (p) =>
          value.id ? (`${p.from.id}/${p.n}` === postLink ||
          `0x${shortenAddress(p.from.id).replace("-", "")}/${p.n}` === postLink) : (
            p.n === value.n
          )
      ),
    [thread, value, postLink]
  );

  useEffect(() => {
    const backlink = {
      from: post,
      to: {
        userId: value.id,
        n: value.n,
      },
    };
    //console.log(`Post ${post.n} sending backlink to ${value.n}`);
    publish("POST_BACKLINK", backlink);
  }, [post, value, publish]);

  const onMouseEnter = useCallback(() => {
    if (refPost != null) {
      publish("POST_HIGHLIGHT", refPost.id);
    }
  }, [publish, refPost]);
  const onMouseLeave = useCallback(() => {
    if (refPost != null) {
      publish("POST_DEHIGHLIGHT", refPost.id);
    }
  }, [publish, refPost]);

  const baseUrl = `${
    post.thread
      ? Router.thread(post.thread)
      : post.board
      ? Router.board(post.board)
      : ""
  }/`;

  const { accounts } = useWeb3();

  const isOp = thread && refPost && thread.op.id === refPost.id;
  const isYou =
    accounts && accounts[0] && refPost && accounts[0] === refPost.from.address;
  const isCrossThread = thread && !refPost;

  return (
    <Link
      className="dchan-postref dchan-link"
      to={`${isCrossThread ? "/" : baseUrl}${postLink}${
        block ? `?block=${block}` : ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <wbr />
      <span className="whitespace-nowrap">&gt;&gt;{postLink}</span>
      {isOp ? " (OP)" : ""}
      {isYou ? " (You)" : ""}
      {
        // Disabled because it would mark as "Cross-thread" posts that were referencing posts hidden by collapsed index view threads
        // isCrossThread ? " (Cross-thread)" : ""
      }
    </Link>
  );
}

function Spoiler({
  children,
  post,
  thread,
  block,
}: {
  children: ParserResult[];
  post: Post;
  thread?: Thread;
  block?: string;
}) {
  return (
    <span className="dchan-post-spoiler">
      {children.map((v) => renderValue(v, post, thread, block))}
    </span>
  );
}

function ExternalLink({ link }: { link: string }) {
  return (
    <a className="dchan-link" href={link} target="_blank" rel="noreferrer">
      {link}
    </a>
  );
}

function IPFSImage({ hash }: { hash: string }) {
  return (
    <details className="inline w-full">
      <summary>
        <a
          className="dchan-link"
          href={`//ipfs.io/ipfs/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          {hash}
        </a>
      </summary>
      <img src={`//ipfs.io/ipfs/${hash}`} alt="" />
    </details>
  );
}

function YoutubeLink({url, id}: {url: string, id: string}) {
  const [isEnabled, setIsEnabled] = useState(false)
  const onClick = useCallback(() => {
    setIsEnabled(!isEnabled)
  }, [isEnabled, setIsEnabled])

  return (
    <span>
        <ExternalLink link={url} /> <button className="dchan-link" onClick={onClick} >({isEnabled ? "unembed" : "embed"})</button>
        {isEnabled ? <iframe
          title={`Youtube video ${id}`}
          itemType="text/html"
          src={`//www.youtube.com/embed/${id}`}
          allowFullScreen={true}
          frameBorder="0"
          ></iframe> : ""}
    </span>
  );
}

function renderValue(
  val: ParserResult,
  post: Post,
  thread?: Thread,
  block?: string
): ReactElement | string {
  switch (val.type) {
    case "text":
      return val.value;
    case "link":
      return <ExternalLink link={val.value} key={val.key} />;
    case "ipfs":
      return <IPFSImage hash={val.hash} key={val.key} />;
    case "newline":
      return <br key={val.key} />;
    case "textquote":
      return (
        <TextQuote post={post} thread={thread} block={block} key={val.key}>
          {val.value}
        </TextQuote>
      );
    case "ref":
      return (
        <Reference
          link={`/${val.id}${block ? `?block=${block}` : ""}`}
          key={val.key}
        >
          {val.id}
        </Reference>
      );
    case "txhashref":
      return (
        <TxHashReference id={val.id} key={val.key}>
          {val.id}
        </TxHashReference>
      );
    case "postref":
      return (
        <PostReference
          post={post}
          thread={thread}
          block={block}
          value={val}
          key={val.key}
        />
      );
    case "boardref":
      return (
        <Reference
          link={`/${val.id}${block ? `?block=${block}` : ""}`}
          key={val.key}
        >
          {val.board}
          {val.id}
        </Reference>
      );
    case "spoiler":
      return (
        <Spoiler post={post} thread={thread} block={block} key={val.key}>
          {val.value}
        </Spoiler>
      );
    case "youtubelink":
      return (
        <YoutubeLink key={val.key} url={val.url} id={val.id} />
      );
  }
}

export const PostBody = memo(({
  post,
  thread,
  block,
  style = {},
  className = "",
}: {
  style?: any;
  className?: string;
  block?: string;
  thread?: Thread;
  post: Post;
}) => {
  const parsedComment = useMemo(
    () => parseComment(post.comment),
    [post.comment]
  );
  return (
    <div
      className={
        className +
        " block text-left break-words font-sans text-sm max-w-100vw dchan-post-body"
      }
      style={style}
      key={`${post.id}-${thread?.id}`}
    >
      {parsedComment.map((v: any) => renderValue(v, post, thread, block))}
    </div>
  );
}, isEqual)