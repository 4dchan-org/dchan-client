import sanitizeHtml from 'sanitize-html';

(window as any).focusPost = function(focusId: any) {
  console.log({focusId})
  PubSub.publish('POST_FOCUS', focusId)
}

export default function PostBody({children, style = {}, onBacklink = () => ({})}: {style?: any, children: any, onBacklink?: (post: string) => void}) {
  const EXTERNAL_LINK_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/igm
  const BACKLINK_REGEX = /&gt;&gt;(\d+)/gm
  const SPOILER_REGEX = /\[spoiler\]((?:.|\s)*?)\[\/spoiler]/gm
  const REF_REGEX = /&gt;&gt;(0[xX][0-9a-fA-F])+/gm
  const TEXT_QUOTES_REGEX = /^&gt;(.*)$/gm
  const NEWLINE_REGEX = /\n/gm

  const sanitized = sanitizeHtml(children)
  
  sanitized.match(BACKLINK_REGEX)?.forEach(onBacklink)

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