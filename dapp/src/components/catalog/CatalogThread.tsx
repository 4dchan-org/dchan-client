import { Thread } from "dchan";
import IPFSImage from "components/IPFSImage";
import PostBody from "components/post/PostBody";
import LowScoreDisclaimer from "components/LowScoreDisclaimer";
import { isLowScore as isLowScoreThread } from "dchan/entities/thread";

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
  } = thread;

  const { ipfsHash, isNsfw, isSpoiler } = image || {
    ipfsHash: "",
    isNsfw: false,
    isSpoiler: false,
  };

  const imgClassName = "w-full pointer-events-none shadow-xl object-contain max-h-320px";
  const isLowScore = isLowScoreThread(thread)

  return (
    <article
      id={id}
      className="dchan-post relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden min-h-12rem max-h-320px max-w-150px break-word w-full h-full place-items-start"
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
      {isLowScore && !isFocused ? (
        <LowScoreDisclaimer onClick={() => onFocus(id)}></LowScoreDisclaimer>
      ) : (
        ""
      )}
      <button onClick={() => onFocus(id)}>
        <div
          className={[
            isFocused ? "bg-tertiary border-bottom-tertiary" : "",
            !isFocused && isLowScore ? "dchan-censor" : "",
          ].join(" ")}
        >
          {ipfsHash && (!isLowScore || isFocused) ? (
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
              <div>
                <strong>{subject}</strong>
              </div>
              <PostBody
                style={{
                  minWidth: isFocused ? "12rem" : "initial",
                  textAlign: "center",
                }}
              >
                {comment}
              </PostBody>
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
      </div>
    </article>
  );
};

export default CatalogThread;
