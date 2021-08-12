import Markdown from "markdown-to-jsx";

export default function PostBody({children, style = {}}: {style?: any, children: any}) {
    return (
        <Markdown
        className="inline-block dchan-post-markdown text-center sm:text-left break-words"
        style={style}
        options={{
          disableParsingRawHTML: true,
          overrides: {
            img: {
              component: ({ children, ...props }) => (
                <a
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  href={props.src}
                  target="_blank"
                >
                {props.src}
                </a>
              ),
            },
            a: {
              component: ({ children, ...props }) => (
                <a
                  {...props}
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                >
                  {children}
                </a>
              ),
            },
          },
        }}
      >
        {children}
      </Markdown>
    )
}