import { backgroundColorAddress, shortenAddress } from "dchan";

export default function IdLabel({
  id,
  className = "",
}: {
  className?: string;
  id: string;
}) {
  const shortId = shortenAddress(id);

  return (
    <span
      style={{ backgroundColor: backgroundColorAddress(shortId) }}
      className={[className, LABEL_CLASSNAME].join(" ")}
      // eslint-disable-next-line
    >
      {shortId}
    </span>
  );
}

export const LABEL_CLASSNAME =
  "font-mono text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs";
