import { Post } from 'dchan';
import { BACKLINK_HTML_SAFE_REGEX, EXTERNAL_LINK_REGEX, NEWLINE_REGEX, REF_BOARD_HTML_SAFE_REGEX, REF_HTML_SAFE_REGEX, REF_POST_HTML_SAFE_REGEX, SPOILER_REGEX, TEXT_QUOTES_HTML_SAFE_REGEX } from 'dchan/regexps';
import { Router } from 'router';
import sanitizeHtml from 'sanitize-html';

export default function PostBody({post, style = {}}: {style?: any, post: Post}) {
  const sanitized = sanitizeHtml(post.comment, {allowedTags: []})
  const baseUrl = `${post.board ? Router.board(post.board) : ""}/${post.thread ? `${post.from.id}/${post.thread.n}/` : ""}`
  const refStyle = "color: rgb(221, 0, 0);";
  const refClasses = "whitespace-nowrap";

  let __html = sanitized
    .replace(TEXT_QUOTES_HTML_SAFE_REGEX, `<span class="text-quote">&gt;$1</span>`) // Text quotes
    .replace(REF_HTML_SAFE_REGEX, `<a href="#/$1" class="${refClasses}" style="${refStyle}"><u>&gt;&gt;$1</u></a>$2`) // 0x refs
    .replace(REF_POST_HTML_SAFE_REGEX, `<a href="#${baseUrl}$1" class="${refClasses}" style="${refStyle}"><u>&gt;&gt;$1</u></a>$2`) // Post refs
    .replace(REF_BOARD_HTML_SAFE_REGEX, `<a href="#/$2" class="${refClasses}" style="${refStyle}"><u>&gt;&gt;$1</u></a>$3`) // Board refs
    .replace(BACKLINK_HTML_SAFE_REGEX, `<a class="${refClasses}" style="${refStyle}" href="#${baseUrl}$1"><u>&gt;&gt;$1</u></a>$2`) // Post backlinks // @HACK
    .replace(SPOILER_REGEX, `<span class="dchan-post-spoiler">$1</span>`) // Spoilers
    .replace(EXTERNAL_LINK_REGEX, `<a class="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="$1" target="_blank" rel="noreferrer">$1</a>`) // Links
    .replace(NEWLINE_REGEX, `<br>`)
    
    return (
      <div
        className="block text-left break-words font-sans text-sm max-w-100vw"
        style={style}
        dangerouslySetInnerHTML={{
          __html
        }}/>
    )
}