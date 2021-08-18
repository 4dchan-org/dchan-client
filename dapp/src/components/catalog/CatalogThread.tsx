import { Thread } from "dchan";
import IPFSImage from "components/IPFSImage";
import PostBody from "components/post/PostBody";

const CatalogThread = ({
  thread,
  isFocused,
  onFocus,
}: {
  thread: Thread;
  isFocused: boolean;
  onFocus: (id: string) => void;
}) => {
  const {
    id,
    isPinned,
    isLocked,
    subject,
    op: { comment, image },
    replyCount,
    imageCount,
    score,
  } = thread;

  const { ipfsHash, isNsfw, isSpoiler } = image || {
    ipfsHash: "",
    isNsfw: false,
    isSpoiler: false,
  };

  const imgClassName =
    "w-full pointer-events-none shadow-xl object-contain";
  const isReported = score / 1_000_000_000 < 1;

  return (
    <article
      id={id}
      className="dchan-post relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden max-h-320px max-w-150px break-word w-full h-full place-items-start"
      style={
        isFocused
          ? {
              maxHeight: "initial",
              maxWidth: "initial",
              zIndex: 900,
              marginLeft: "-2rem",
              marginRight: "-2rem",
              width: "14rem",
            }
          : {}
      }
    >
      <button onClick={() => onFocus(id)}>
        <div
          className={[
            isFocused ? "bg-tertiary border-bottom-tertiary" : "",
            !isFocused && isReported ? "dchan-censor" : "",
          ].join(" ")}
        >
          {ipfsHash ? (
            <div>
              <IPFSImage
                className={imgClassName}
                hash={ipfsHash}
                expandable={false}
                thumbnail={false}
                isSpoiler={isSpoiler}
                isNsfw={isNsfw}
              />
            </div>
          ) : (
            ""
          )}
          <div className="p-1">
            <div>
              R:<strong>{replyCount}</strong>, I:<strong>{imageCount}</strong>
            </div>
            <div className="word-wrap">
              <strong>{subject}</strong>
              <PostBody style={{ minWidth: isFocused ? "12rem" : "initial", textAlign: "center" }}>{comment}</PostBody>
            </div>
          </div>
        </div>
      </button>
      <div className="absolute top-0 right-0">
        {isPinned ? (
          <span title="Thread pinned. This might be important.">📌</span>
        ) : (
          ""
        )}
        {isLocked ? (
          <span title="Thread locked. You cannot post.">🔒</span>
        ) : (
          ""
        )}
        {isReported ? (
          <span title="Post was reported too many times and was therefore hidden to shield your virgin eyes. You're welcome.">
            ⚠️
          </span>
        ) : (
          ""
        )}
      </div>
    </article>
  );
};

export default CatalogThread;
