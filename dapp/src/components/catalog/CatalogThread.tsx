import { Board, Thread } from "dchan"
import IPFSImage from "components/IPFSImage"
import { Link } from "react-router-dom"

const CatalogThread = ({thread: {
    id,
    isPinned,
    isLocked,
    op: {
        subject,
        comment,
        image: {
            ipfsHash
        }
    },
    replyCount,
    imageCount
}, board}: {thread: Thread, board: Board}) => (
    <article id={id} className="dchan-post relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden max-h-320px max-w-150px break-word on-target-expand-post w-full h-full place-items-start">
        <a className="on-parent-target-hide absolute top-0 left-0 right-0 bottom-0" href={`#${id}`}></a>

        <Link to={`/${board.name}/${board.id}/${id}`}>
            <div className="on-parent-target-highlight">
                <div>
                    <IPFSImage className="w-full max-h-150px pointer-events-none shadow-xl object-contain" hash={ipfsHash} />
                </div>
                <div className="p-1">
                    <div>
                    R:<strong>{replyCount}</strong>,
                    I:<strong>{imageCount}</strong>
                    </div>
                    <div className="word-wrap">
                        <strong>
                            {subject}
                        </strong>
                        <blockquote className="whitespace-pre-wrap">{comment}</blockquote>
                    </div>
                </div>
            </div>
        </Link>
        <div className="absolute top-0 right-0">
            {isPinned ? <span title="Thread pinned. This might be important.">📌</span> : ""}
            {isLocked ? <span title="Thread locked. You cannot post.">🔒</span> : ""}
        </div>
    </article>
)

export default CatalogThread