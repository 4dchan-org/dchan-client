import { BACKLINK_HTML_SAFE_REGEX, EXTERNAL_LINK_REGEX, IPFS_HASH_REGEX, NEWLINE_REGEX, REF_BOARD_HTML_SAFE_REGEX, REF_HTML_SAFE_REGEX, SPOILER_REGEX, TEXT_QUOTES_HTML_SAFE_REGEX } from 'dchan/regexps';
import sanitizeHtml from 'sanitize-html';

(window as any).focusPost = function(n: any) {
  PubSub.publish('POST_FOCUS', n)
}

export default function PostBody({children, style = {}}: {style?: any, children: any}) {
  const sanitized = sanitizeHtml(children)

  let __html = sanitized
    .replace(TEXT_QUOTES_HTML_SAFE_REGEX, "<span class=\"text-quote\">&gt;$1</span>") // Text quotes
    .replace(REF_HTML_SAFE_REGEX, "<a href=\"/#/$1\" class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\">&gt;&gt;$1</a>") // 0x refs
    .replace(REF_BOARD_HTML_SAFE_REGEX, "<a href=\"/#$1\" class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\">&gt;&gt;$1</a>") // Board refs
    .replace(SPOILER_REGEX, "<span class=\"dchan-post-spoiler\">$1</span>") // Spoilers
    .replace(BACKLINK_HTML_SAFE_REGEX, "<button class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" onclick=\"focusPost($1)\">&gt;&gt;$1</button>") // Post backlinks
    .replace(EXTERNAL_LINK_REGEX, "<a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" href=\"$1\" target=\"_blank\" rel=\"noreferrer\">$1</a>") // Links
    .replace(IPFS_HASH_REGEX, "<details class=\"inline\"><summary><a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" href=\"//ipfs.io/ipfs/$1\" target=\"_blank\" rel=\"noreferrer\">$1</a></summary><img src=\"//ipfs.io/ipfs/$1\"/></details>") // IPFS image embed
    .replace(NEWLINE_REGEX, "<br>")
    
    return (
      <div
        className="inline-block text-left break-words font-sans"
        style={style}
        dangerouslySetInnerHTML={{
          __html
        }}/>
    )
}