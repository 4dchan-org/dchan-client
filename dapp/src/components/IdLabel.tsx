import { backgroundColorAddress, shortenAddress } from "dchan";

function luma(rgb: string): number {
  const rgbNum = parseInt(rgb.slice(1), 16);
  const colors = [
    (rgbNum >> 16) & 0xFF,
    (rgbNum >> 8) & 0xFF,
    rgbNum & 0xFF
  ];
  return colors[0] * 0.299 + colors[1] * 0.587 + colors[2] * 0.114;
}

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
  const backgroundColor = backgroundColorAddress(shortId);
  if (!children) {
    children = shortId;
  }

  return (
    <span
      style={{ backgroundColor: backgroundColor }}
      className={[
        className,
        LABEL_CLASSNAME,
        luma(backgroundColor) > 125 ? "text-black" : "text-white"
      ].join(" ")}
      // eslint-disable-next-line
    >
      {children}
    </span>
  );
}

export const LABEL_CLASSNAME =
  "font-mono pt-0.5 px-0.5 mx-0.5 rounded opacity-75 hover:opacity-100 text-xs whitespace-nowrap";
