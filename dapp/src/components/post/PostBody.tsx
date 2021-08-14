import Markdown from "markdown-to-jsx";
import sanitizeHtml from 'sanitize-html';

(window as any).quotePost = function(quoting: any) {
  console.log({quoting})
  PubSub.publish('FORM_QUOTE', quoting)
}

export default function PostBody({children, style = {}}: {style?: any, children: any}) {
  const kLINK_DETECTION_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/igm
  const sanitized = sanitizeHtml(children)
  // console.log({sanitized})
  let __html = sanitized
    .replace(/^&gt;(.*)$/gm, "<span class=\"text-quote\">&gt;$1</span>") // Quotes
    .replace(/&gt;&gt;(0[xX][0-9a-fA-F])+/gm, "<a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\">&gt;&gt;$1</a>") // Post quotes
    .replace(/\[spoiler\]((?:.|\s)*?)\[\/spoiler]/gm, "<span class=\"dchan-post-spoiler\">$1</span>") // Spoiler
    .replace(/&gt;&gt;(\d)+/gm, "<a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" onclick=\"quotePost($1)\" href=\"#dchan-post-form\">&gt;&gt;$1</a>") // Post quotes
    .replace(kLINK_DETECTION_REGEX, "<a class=\"text-blue-600 visited:text-purple-600 hover:text-blue-500\" href=\"$1\" target=\"_blank\" rel=\"noreferrer\">$1</a>") // Links
    .replace(/\n/gm, "<br>")
    
    return (
      <div
        className="inline-block text-center sm:text-left break-words font-sans"
        style={style}
        dangerouslySetInnerHTML={{
          __html
        }}/>
    )
}