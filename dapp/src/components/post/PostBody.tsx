import { Post } from 'dchan';
import { Router } from 'router';
import parseComment, { ParserResult } from 'dchan/postparse';
import { ReactElement } from 'react';

function TextQuote({children, post}: {children: ParserResult[], post: Post}) {
  return (
    <span className="text-quote">
      &gt;{children.map(v => renderValue(v, post))}
    </span>
  );
}

function Reference({link, children}: {link: string; children: string}) {
  return (
    <a
      className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
      href={link}
    >
      &gt;&gt;{children}
    </a>
  );
}

function Spoiler({children, post}: {children: ParserResult[], post: Post}) {
  return (
    <span className="dchan-post-spoiler">
      {children.map(v => renderValue(v, post))}
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

function renderValue(val: ParserResult, post: Post): ReactElement | string {
  switch(val.type) {
    case "text":
      return val.value;
    case "link":
      return <ExternalLink link={val.value} />;
    case "ipfs":
      return <IPFSImage hash={val.value} />;
    case "newline":
      return <br/>;
    case "textquote":
      return <TextQuote post={post}>{val.value}</TextQuote>;
    case "ref":
      return <Reference link={`#/${val.value}`}>{val.value}</Reference>;
    case "postref":
      const baseUrl = `${post.board ? Router.board(post.board) : ""}/${post.thread ? `${post.from.id}/${post.thread.n}/` : ""}`;
      return <Reference link={`#${baseUrl}${val.value}`}>{val.value}</Reference>;
    case "boardref":
      return <Reference link={`#/${val.value[1]}`}>{val.value[0]}</Reference>;
    case "spoiler":
      return <Spoiler post={post}>{val.value}</Spoiler>;
  }
}

export default function PostBody({post, style = {}}: {style?: any, post: Post}) {
  return (
    <div
      className="block text-left break-words font-sans text-sm max-w-100vw"
      style={style}
    >
      {parseComment(post.comment).map(v => renderValue(v, post))}
    </div>
  )
}