import { Post, Thread } from 'dchan';
import { Router } from 'router';
import parseComment, { ParserResult, PostReferenceValue } from 'dchan/postparse';
import { ReactElement, useCallback } from 'react';
import usePubSub from 'hooks/usePubSub';

function TextQuote({children, post, thread}: {children: ParserResult[], post: Post, thread?: Thread}) {
  return (
    <span className="text-quote">
      &gt;{children.map(v => renderValue(v, post, thread))}
    </span>
  );
}

function Reference({link, children}: {link: string; children: string | string[]}) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      href={link}
    >
      &gt;&gt;{children}
    </a>
  );
}

function PostReference({post, thread, value}: {post: Post, thread?: Thread, value: PostReferenceValue}) {
  const { publish } = usePubSub();
  const postLink = `${value.id}/${value.n}`;

  const refPost = thread?.replies?.find(p => `${p.from.id}/${p.n}` === postLink);

  const onMouseEnter = useCallback(
    () => {
      if (refPost != null) {
        publish("POST_HIGHLIGHT", refPost.id)
      }
    },
    [publish, refPost]
  );
  const onMouseLeave = useCallback(
    () => {
      if (refPost != null) {
        publish("POST_DEHIGHLIGHT", refPost.id)
      }
    },
    [publish, refPost]
  );

  const baseUrl = `${post.board ? Router.board(post.board) : ""}/${post.thread ? `${post.from.id}/${post.thread.n}/` : ""}`;

  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      href={`#${baseUrl}${postLink}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      &gt;&gt;{postLink}
    </a>
  );
}

function Spoiler({children, post, thread}: {children: ParserResult[], post: Post, thread?: Thread}) {
  return (
    <span className="dchan-post-spoiler">
      {children.map(v => renderValue(v, post, thread))}
    </span>
  );
}

function ExternalLink({link}: {link: string}) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      {link}
    </a>
  );
}

function IPFSImage({hash}: {hash: string}) {
  return (
    <details className="inline">
      <summary>
        <a
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          href="//ipfs.io/ipfs/$1"
          target="_blank"
          rel="noreferrer"
        >
          {hash}
        </a>
      </summary>
      <img src={`//ipfs.io/ipfs/${hash}`}/>
    </details>
  );
}

function renderValue(val: ParserResult, post: Post, thread?: Thread): ReactElement | string {
  switch(val.type) {
    case "text":
      return val.value;
    case "link":
      return <ExternalLink link={val.value} />;
    case "ipfs":
      return <IPFSImage hash={val.hash} />;
    case "newline":
      return <br/>;
    case "textquote":
      return <TextQuote post={post} thread={thread}>{val.value}</TextQuote>;
    case "ref":
      return <Reference link={`#/${val.id}`}>{val.id}</Reference>;
    case "postref":
      return <PostReference post={post} thread={thread} value={val} />;
    case "boardref":
      return <Reference link={`#/${val.id}`}>{val.board}{val.id}</Reference>;
    case "spoiler":
      return <Spoiler post={post} thread={thread}>{val.value}</Spoiler>;
  }
}

export default function PostBody({post, thread, style = {}}: {style?: any, thread?: Thread, post: Post}) {
  return (
    <div
      className="block text-left break-words font-sans text-sm max-w-100vw"
      style={style}
    >
      {parseComment(post.comment).map(v => renderValue(v, post, thread))}
    </div>
  )
}