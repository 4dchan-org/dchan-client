import { useCallback, useState, useRef, useEffect } from "react";
import spoilerSrc from "assets/images/spoiler.png";
import nsfwSrc from "assets/images/nsfw.png";
import ipfsLoadingSrc from "assets/images/ipfs.png";
import ipfsErrorSrc from "assets/images/ipfs_error.png";
import useMouse from "@react-hook/mouse-position";
import { useWindowSize } from "react-use";
import { getIPFSImgSrcs } from "dchan/services/ipfs"

export const IPFSImage = ({
  hash,
  style,
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
  isSpoiler?: boolean;
  isNsfw?: boolean;
  expandable?: boolean;
  thumbnail?: boolean;
  thumbnailClass?: string;
}) => {
  const mouseRef = useRef(null);
  const [imgSrcs, setImgSrcs] = useState<string[]>(getIPFSImgSrcs(hash));
  const [imgError, setImgError] = useState<any>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  //const imgLoading = true;
  const [imgSrc, setImgSrc] = useState<string>();
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [showNsfw, setShowNsfw] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(!thumbnail);
  const imgRef = useRef<HTMLImageElement>(null);

  thumbnailClass = thumbnail ? thumbnailClass : "";
  const canShow = (!isNsfw || showNsfw) && (!isSpoiler || showSpoiler);

  const next = useCallback(() => {
    const _imgSrcs = [...imgSrcs];
    const imgSrc = _imgSrcs.shift();
    if (!imgSrc) return;
    setImgSrc(imgSrc);
    setImgSrcs([..._imgSrcs]);
  }, [imgSrcs, setImgSrc, setImgSrcs]);

  useEffect(() => {
    !imgSrc && next();
  }, [next, imgSrc]);

  const retry = useCallback(() => {
    setImgLoading(true);
    setImgSrc(`${imgSrc?.replace(/[&?]t=\d+/, "")}?t=${new Date().getTime()}`);
    setImgError(undefined);
  }, [imgSrc, setImgLoading, setImgSrc, setImgError]);

  const onError = useCallback(
    (e: any) => {
      console.log("ipfs load error", e.target.src);
      setImgLoading(false);
      setImgError(`${e.target.src}: failed to load.`);
      next();
    },
    [next, setImgError, setImgLoading]
  );

  const windowSize = useWindowSize();
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
    flip: boolean;
  } | null>(null);
  const mouse = useMouse(mouseRef);
  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = imgRef.current || {
      clientWidth: 0,
      clientHeight: 0,
    };
    if (
      canShow &&
      !expand &&
      windowSize.width > 768 &&
      mouse.clientX !== null &&
      mouse.clientY !== null
    ) {
      const position = {
        x: Math.max(
          width / 2,
          Math.min(window.outerWidth - width / 2, mouse.clientX)
        ),
        y: Math.max(
          height / 2,
          Math.min(window.outerHeight - height / 2, mouse.clientY)
        ),
        flip: mouse.clientX > windowSize.width / 2,
      };
      setHoverPosition(position);
    } else {
      setHoverPosition(null);
    }
  }, [expand, canShow, windowSize, hash, imgRef, mouse, setHoverPosition]);

  const onLoad = useCallback(() => setImgLoading(false), [setImgLoading])

  const onClick = useCallback(() => {
    if (expandable) {
      setExpand(!expand);
    }
  }, [expandable, expand, setExpand])

  const onShowNsfw = useCallback(() => setShowNsfw(true), [setShowNsfw])

  const onShowSpoiler = useCallback(() => setShowSpoiler(true), [setShowSpoiler])

  return (
    <span ref={mouseRef} className="relative">
      <img
        className={`${className} ${
          !expand || imgError ? thumbnailClass : ""
        } animation-fade-in`}
        style={
          imgLoading
            ? {
                ...style,
                position: "absolute",
                ...(canShow ? {} : { visibility: "hidden" }),
              }
            : !!imgError || !canShow
            ? { display: "none" }
            : style
        }
        src={imgSrc}
        onLoad={onLoad}
        loading={"eager"}
        onClick={onClick}
        onError={onError}
        alt=""
        ref={imgRef}
      />
      {hoverPosition && !imgLoading && !imgError ? (
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none opacity-98 z-50">
          <img
            className={`fixed max-w-75vw max-h-75vh z-50 overflow-hidden`}
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
              transform: `translate(${
                hoverPosition.flip ? "-100" : "0"
              }%, -50%)`,
              transition: "position 50ms ease-out",
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
            <div>
              {imgLoading ? (
                <div className="relative center grid">
                  <img
                    className={thumbnailClass+ " animation-download"}
                    style={style}
                    src={ipfsLoadingSrc}
                    onClick={retry}
                    alt={``}
                  />
                  <div
                    className="p-2 text-xs opacity-80 absolute top-0 left-0 bg-primary animation-fade-in"
                    title={`Retrieving image from IPFS.`}
                  >
                    Loading from IPFS...
                    {imgSrc ? <div>Attempting <i>{new URL(imgSrc).hostname}</i></div> : <></>}
                  </div>
                </div>
              ) : imgError ? (
                <div className="relative center grid">
                  <img
                    className={thumbnailClass+ " animation-fade-in"}
                    style={style}
                    src={ipfsErrorSrc}
                    onClick={retry}
                    alt={``}
                  />
                  <div className="p-2">IPFS Image Load Error</div>
                </div>
              ) : (
                ""
              )}
              {!imgLoading && !imgError && !showSpoiler && isSpoiler ? (
                <img
                  className={thumbnailClass}
                  src={spoilerSrc}
                  alt="SPOILER"
                  onClick={onShowSpoiler}
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
                  onClick={onShowNsfw}
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
