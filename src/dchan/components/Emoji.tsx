import { memo } from 'react'
import twemoji from 'twemoji'

// https://gist.github.com/chibicode/fe195d792270910226c928b69a468206
export const Emoji = memo(({ emoji }: { emoji: string }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: 'svg',
        ext: '.svg',
        base: "/vendors/twemoji/"
      })
    }}
  />
))