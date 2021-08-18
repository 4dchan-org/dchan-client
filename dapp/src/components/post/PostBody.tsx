import { BACKLINK_REGEX, EXTERNAL_LINK_REGEX, NEWLINE_REGEX, REF_REGEX, SPOILER_REGEX, TEXT_QUOTES_REGEX } from 'dchan';
import sanitizeHtml from 'sanitize-html';

(window as any).focusPost = function(n: any) {
  PubSub.publish('POST_FOCUS', n)
}

export default function PostBody({children, style = {}}: {style?: any, children: any}) {
  const sanitized = sanitizeHtml(children)

  let __html = sanitized
    .replace(TEXT_QUOTES_REGEX, "<span class=\"text-quote\">&gt;$1</span>") // Text quotes
    .replace(REF_REGEX, "<a href=\"/#/$1\" class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\">&gt;&gt;$1</a>") // 0xRefs
    .replace(SPOILER_REGEX, "<span class=\"dchan-post-spoiler\">$1</span>") // Spoilers
    .replace(BACKLINK_REGEX, "<button class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" onclick=\"focusPost($1)\">&gt;&gt;$1</button>") // Post backlinks
    .replace(EXTERNAL_LINK_REGEX, "<a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" href=\"$1\" target=\"_blank\" rel=\"noreferrer\">$1</a>") // Links
    .replace(NEWLINE_REGEX, "<br>")
    
    return (
      <div
        className="inline-block text-center sm:text-left break-words font-sans"
        style={style}
        dangerouslySetInnerHTML={{
          __html
        }}/>
    )
}