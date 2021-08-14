import { useState } from "react";
import ipfsLoadingSrc from "assets/images/ipfs.png";
import ipfsErrorSrc from "assets/images/ipfs_error.png";

export default function IPFSImage({
  hash,
  className,
  style,
  loading,
}: {
  hash: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
}) {
  const [imgError, setImgError] = useState<any>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>(`https://ipfs.io/ipfs/${hash}`);

  !!imgError && console.log({imgError})

  return (
    <span>
      {imgLoading ? (
        <span className="relative">
          <img
            className={"h-150px w-150px animation-download"}
            style={style}
            src={ipfsLoadingSrc}
          />
          <span>Loading...</span>
        </span>
      ) : (
        ""
      )}
      <img
        className={className}
        style={imgLoading ? { ...style, visibility: "hidden" } : style}
        src={imgSrc}
        onLoad={() => setImgLoading(false)}
        loading={loading}
        onError={e => {
          setImgSrc(ipfsErrorSrc)
          setImgError(e)
        }}
      />
    </span>
  );
}
