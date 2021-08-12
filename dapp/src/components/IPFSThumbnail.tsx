import { useState } from "react";
import spoilerSrc from "assets/images/spoiler.png";
import nsfwSrc from "assets/images/nsfw.png";
import IPFSImage from "./IPFSImage";

export default function IPFSThumbnail({
  hash,
  isSpoiler = false,
  isNsfw = false,
}: {
  hash: string;
  isSpoiler?: boolean;
  isNsfw?: boolean;
}) {
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [showNsfw, setShowNsfw] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const thumbnailClass = "max-w-32 max-h-32"
  const coverClass = "absolute left-0 right-0 top-0 bottom-0"
  const canShow = (!isNsfw || showNsfw) && (!isSpoiler || showSpoiler)

  return (
    <span className="relative">
      <span
        className={"filter " + (!canShow ? "blur-md" : "")}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <IPFSImage
          className={!expand ? thumbnailClass : ""}
          hash={hash}
          loading="lazy"
        />
      </span>
      {!showSpoiler && isSpoiler ? (
        <img
          className={coverClass + thumbnailClass}
          src={spoilerSrc}
          onClick={() => {
            setShowSpoiler(!showSpoiler);
          }}
        ></img>
      ) : (
        ""
      )}
      {!showNsfw && isNsfw? (
        <img
          className={coverClass + thumbnailClass}
          src={nsfwSrc}
          onClick={() => {
            setShowNsfw(!showNsfw);
          }}
        ></img>
      ) : (
        ""
      )}
    </span>
  );
}
