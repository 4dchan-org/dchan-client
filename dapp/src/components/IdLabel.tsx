import { backgroundColorAddress, shortenAddress } from "dchan";

export default function IdLabel({
  id,
  className = "",
  children,
}: {
  className?: string;
  id: string;
  children?: string | string[];
}) {
  const shortId = shortenAddress(id);
  if (!children) {
    children = shortId;
  }

  return (
    <span
      style={{ backgroundColor: backgroundColorAddress(shortId) }}
      className={[className, LABEL_CLASSNAME].join(" ")}
      // eslint-disable-next-line
    >
      {children}
    </span>
  );
}

export const LABEL_CLASSNAME =
  "font-mono text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs whitespace-nowrap";
