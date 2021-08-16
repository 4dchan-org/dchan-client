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
  const ipfsSrc = `https://ipfs.io/ipfs/${hash}`
  const [imgError, setImgError] = useState<any>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>(ipfsSrc);
  const [retryTimeout, setRetryTimeout] = useState<number>(2000)

  const retry = () => {
    setImgLoading(true)
    setImgSrc(ipfsSrc + "?t="+ (new Date('2012.08.10').getTime()))
    setImgError(undefined)
    setRetryTimeout(Math.min(retryTimeout * 2, 60000))
  }

  !!imgError && console.log({imgError})

  return (
    <div>
      {imgLoading ? (
        <div className="relative">
          <img
            className={"h-150px w-150px animation-download"}
            style={style}
            src={ipfsLoadingSrc}
          />
          <div>Loading...</div>
        </div>
      ) : imgError ? <div className="p-2 opacity-50 hover:opacity-100">Image load error</div> : ""}
      <img
        className={className + " animation-fade-in"}
        style={imgLoading ? { ...style, visibility: "hidden" } : style}
        src={imgSrc}
        onLoad={() => setImgLoading(false)}
        loading={loading}
        onClick={() => {
          setImgError(undefined)
        }}
        onError={e => {
          setImgSrc(ipfsErrorSrc)
          setImgError(e)
          setTimeout(retry, retryTimeout)
        }}
      />
    </div>
  );
}
