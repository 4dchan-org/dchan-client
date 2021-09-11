import { Post } from 'dchan';
import { BACKLINK_HTML_SAFE_REGEX, EXTERNAL_LINK_REGEX, IPFS_HASH_REGEX, NEWLINE_REGEX, REF_BOARD_HTML_SAFE_REGEX, REF_HTML_SAFE_REGEX, REF_POST_HTML_SAFE_REGEX, SPOILER_REGEX, TEXT_QUOTES_HTML_SAFE_REGEX } from 'dchan/regexps';
import { Router } from 'router';
import sanitizeHtml from 'sanitize-html';

export default function PostBody({post, style = {}}: {style?: any, post: Post}) {
  const sanitized = sanitizeHtml(post.comment, {allowedTags: []})
  const baseUrl = `${post.board ? Router.board(post.board) : ""}/${post.thread ? `${post.from.id}/${post.thread.n}/` : ""}`

  let __html = sanitized
    .replace(TEXT_QUOTES_HTML_SAFE_REGEX, `<span class="text-quote">&gt;$1</span>`) // Text quotes
    .replace(REF_HTML_SAFE_REGEX, `<a href="/#/$1" class="text-blue-600 visited:text-purple-600 hover:text-blue-500">&gt;&gt;$1$2</a>`) // 0x refs
    .replace(REF_POST_HTML_SAFE_REGEX, `<a href="/#${baseUrl}$1" class="text-blue-600 visited:text-purple-600 hover:text-blue-500">&gt;&gt;$1$2</a>`) // Post refs
    .replace(REF_BOARD_HTML_SAFE_REGEX, `<a href="/#/$2" class="text-blue-600 visited:text-purple-600 hover:text-blue-500">&gt;&gt;$1$3</a>`) // Board refs
    .replace(BACKLINK_HTML_SAFE_REGEX, `<a class="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="#${baseUrl}$1">&gt;&gt;$1$2</a>`) // Post backlinks // @HACK
    .replace(SPOILER_REGEX, `<span class="dchan-post-spoiler">$1</span>`) // Spoilers
    .replace(EXTERNAL_LINK_REGEX, `<a class="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="$1" target="_blank" rel="noreferrer">$1</a>`) // Links
    .replace(IPFS_HASH_REGEX, `<details class="inline"><summary><a class="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="//ipfs.io/ipfs/$1" target="_blank" rel="noreferrer">$1</a></summary><img src="//ipfs.io/ipfs/$1"/></details>`) // IPFS image embed
    .replace(NEWLINE_REGEX, `<br>`)
    
    return (
      <div
        className="inline-block text-left break-words font-sans"
        style={style}
        dangerouslySetInnerHTML={{
          __html
        }}/>
    )
}