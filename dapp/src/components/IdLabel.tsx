import { backgroundColorAddress, shortenAddress } from "services";

export default function IdLabel({
  id,
  className = "",
  children
}: {
  className?: string;
  id: string;
  children?: any;
}) {
  const shortId = shortenAddress(id);
  if (children == null) {
    children = shortId;
  }

  return (
    <span
      style={{ backgroundColor: backgroundColorAddress(shortId) }}
      className={[className, LABEL_CLASSNAME].join(" ")}
    >
      {children}
    </span>
  );
}

export const LABEL_CLASSNAME =
  "font-mono font-bold text-readable-anywhere pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs whitespace-nowrap";
