import { Board, Thread } from "dchan"
import IPFSImage from "components/IPFSImage"
import { Link } from "react-router-dom"
import spoilerSrc from "assets/images/spoiler.png";
import nsfwSrc from "assets/images/nsfw.png";
import PostBody from "components/post/PostBody";
import { useState } from "react";

const CatalogThread = ({thread: {
    id,
    isPinned,
    isLocked,
    subject,
    op: {
        comment,
        image: {
            ipfsHash,
            isNsfw,
            isSpoiler
        }
    },
    replyCount,
    imageCount
}, board}: {thread: Thread, board: Board}) => {
    const [focused, setFocused] = useState<boolean>(false);

    const onExternalPostCatalogFocus = (_: any, focusId: string) => {
        console.log({focusId})
        setFocused(id == focusId)
    }

    PubSub.subscribe('POST_CATALOG_FOCUS', onExternalPostCatalogFocus);

    const focusPost = () => {
        console.log({id})
        PubSub.publish('POST_CATALOG_FOCUS', id)
    }

    const imgClassName = "w-full max-h-150px pointer-events-none shadow-xl object-contain"
    return (
        <article id={id} className="dchan-post relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden max-h-320px max-w-150px break-word w-full h-full place-items-start" style={focused ? {
            maxHeight: "initial",
            maxWidth: "initial",
            zIndex: 900,
            marginLeft: "-2rem",
            marginRight: "-2rem",
            width: "14rem",
        } : {}}>
            {!focused ? <a href={window.location.href} onClick={focusPost} className="absolute top-0 left-0 right-0 bottom-0"></a> : ""}

            <Link to={`/${board.name}/${board.id}/${id}`}>
                <div className={focused ? "bg-tertiary border-bottom-tertiary" : ""}>
                    <div>
                        <IPFSImage className={(isSpoiler || isNsfw ? "filter blur brightness-50 contrast-50 " : "") + imgClassName} hash={ipfsHash} />
                        {isSpoiler ? (
                            <img
                            className={imgClassName}
                            src={spoilerSrc}
                            ></img>
                        ) : isNsfw? (
                            <img
                            className={imgClassName}
                            src={nsfwSrc}
                            ></img>
                        ): ""}
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
                            <PostBody style={{textAlign: "center"}}>{comment}</PostBody>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="absolute top-0 right-0">
                {isPinned ? <span title="Thread pinned. This might be important.">📌</span> : ""}
                {isLocked ? <span title="Thread locked. You cannot post.">🔒</span> : ""}
            </div>
        </article>)
}

export default CatalogThread