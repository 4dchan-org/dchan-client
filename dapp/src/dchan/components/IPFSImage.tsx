import { useCallback, useState, useRef, useEffect } from "react";
import spoilerSrc from "assets/images/spoiler.png";
import nsfwSrc from "assets/images/nsfw.png";
import ipfsLoadingSrc from "assets/images/ipfs.png";
import ipfsErrorSrc from "assets/images/ipfs_error.png";
import useMouse from "@react-hook/mouse-position";

export const IPFSImage = ({
  hash,
  style,
  htmlLoading = "lazy",
  className = "",
  isSpoiler = false,
  isNsfw = false,
  expandable = false,
  thumbnail = false,
  thumbnailClass = "max-w-8rem max-h-32",
}: {
  hash: string;
  className?: string;
  style?: React.CSSProperties;
  htmlLoading?: "eager" | "lazy";
  isSpoiler?: boolean;
  isNsfw?: boolean;
  expandable?: boolean;
  thumbnail?: boolean;
  thumbnailClass?: string;
}) => {
  const mouseRef = useRef(null);
  const ipfsSrc = `https://ipfs.io/ipfs/${hash}`;
  const [imgError, setImgError] = useState<any>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>(ipfsSrc);
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [showNsfw, setShowNsfw] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(!thumbnail);
  const imgRef = useRef<HTMLImageElement>(null);

  thumbnailClass = thumbnail ? thumbnailClass : "";
  const canShow = (!isNsfw || showNsfw) && (!isSpoiler || showSpoiler);

  const retry = useCallback(() => {
    setImgLoading(true);
    setImgSrc(`${ipfsSrc}?t=${new Date().getTime()}`);
    setImgError(undefined);
  }, [ipfsSrc, setImgLoading, setImgSrc, setImgError]);

  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const mouse = useMouse(mouseRef);
  useEffect(() => {
    const { naturalWidth: width, naturalHeight: height } = imgRef.current || {
      naturalWidth: 0,
      naturalHeight: 0,
    };
    if (mouse.clientX !== null && mouse.clientY !== null) {
      const position = {
        x: Math.max(
          width / 2,
          Math.min(window.outerWidth - width / 2, mouse.clientX)
        ),
        y: Math.max(
          height / 2,
          Math.min(window.outerHeight - height / 2, mouse.clientY)
        ),
      };
      setHoverPosition(position);
    } else {
      setHoverPosition(null);
    }
  }, [hash, imgRef, mouse, setHoverPosition]);

  return (
    <span ref={mouseRef} className="relative">
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
        ref={imgRef}
      />
      {hoverPosition && !imgLoading && !imgError ? (
        <div className="absolute top-0 left-0 overflow-hidden pointer-events-none opacity-95 z-50">
          <img
            className={`fixed max-w-75vw max-h-75vh z-50 overflow-hidden`}
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
              transform: "translate(-50%, -50%)",
              transition: "position 50ms ease-out"
            }}
            src={imgSrc}
            alt=""
          />
        </div>
      ) : (
        <></>
      )}
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
                    alt={``}
                  />
                  <div className="p-2" title={`Retrieving image from IPFS.`}>
                    Loading...
                  </div>
                </div>
              ) : imgError ? (
                <div className="relative center grid">
                  <img
                    className={"h-150px w-150px animation-fade-in"}
                    style={style}
                    src={ipfsErrorSrc}
                    onClick={retry}
                    alt={``}
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
                />
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
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </span>
      </div>
    </span>
  );
};
