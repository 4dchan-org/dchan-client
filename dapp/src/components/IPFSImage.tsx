import { useCallback, useState } from "react";
import spoilerSrc from "assets/images/spoiler.png";
import nsfwSrc from "assets/images/nsfw.png";
import ipfsLoadingSrc from "assets/images/ipfs.png";
import ipfsErrorSrc from "assets/images/ipfs_error.png";

export default function IPFSImage({
  hash,
  style,
  htmlLoading = "lazy",
  className = "",
  isSpoiler = false,
  isNsfw = false,
  expandable = false,
  thumbnail = false,
}: {
  hash: string;
  className?: string;
  style?: React.CSSProperties;
  htmlLoading?: "eager" | "lazy";
  isSpoiler?: boolean;
  isNsfw?: boolean;
  expandable?: boolean;
  thumbnail?: boolean;
}) {
  const ipfsSrc = `https://ipfs.io/ipfs/${hash}`;
  const [imgError, setImgError] = useState<any>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>(ipfsSrc);
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [showNsfw, setShowNsfw] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(!thumbnail);

  const thumbnailClass = thumbnail ? "max-w-8rem max-h-32" : "";
  const canShow = (!isNsfw || showNsfw) && (!isSpoiler || showSpoiler);

  const retry = useCallback(() => {
    setImgLoading(true);
    setImgSrc(`${ipfsSrc}?t=${new Date().getTime()}`);
    setImgError(undefined);
  }, [ipfsSrc, setImgLoading, setImgSrc, setImgError]);

  return (
    <span>
      <img
        className={`${className} ${
          !expand || imgError ? thumbnailClass : ""
        } animation-fade-in`}
        style={
          imgLoading
            ? { ...style, visibility: "hidden", position: "absolute" }
            : !!imgError || !canShow
            ? { display: "none" }
            : style
        }
        src={imgSrc}
        onLoad={() => setImgLoading(false)}
        loading={htmlLoading}
        onClick={() => {
          if (expandable) {
            setExpand(!expand);
          }
        }}
        onError={(e) => {
          setImgLoading(false);
          setImgError(e);
        }}
        alt=""
      />
      <div className={`${className} relative`}>
        <span>
          <div>
            <div className="opacity-50">
              {imgLoading ? (
                <div className="relative center grid">
                  <img
                    className={"h-150px w-150px animation-download"}
                    style={style}
                    src={ipfsLoadingSrc}
                    onClick={retry}
                    alt=""
                  />
                  <div className="p-2">Loading...</div>
                </div>
              ) : imgError ? (
                <div className="relative center grid">
                  <img
                    className={"h-150px w-150px animation-fade-in"}
                    style={style}
                    src={ipfsErrorSrc}
                    onClick={retry}
                    alt=""
                  />
                  <div className="p-2">IPFS image load error</div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {!imgLoading && !imgError && !showSpoiler && isSpoiler ? (
                <img
                  className={thumbnailClass}
                  src={spoilerSrc}
                  alt="SPOILER"
                  onClick={() => setShowSpoiler(true)}
                ></img>
              ) : (
                ""
              )}
              {!imgLoading &&
              !imgError &&
              (showSpoiler || !isSpoiler) &&
              !showNsfw &&
              isNsfw ? (
                <img
                  className={thumbnailClass}
                  src={nsfwSrc}
                  alt="NSFW"
                  onClick={() => setShowNsfw(true)}
                ></img>
              ) : (
                ""
              )}
            </div>
          </div>
        </span>
      </div>
    </span>
  );
}
