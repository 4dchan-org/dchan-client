export default function ({
  value,
  className = "",
  maxLength,
}: {
  className?: string,
  value: number;
  maxLength: number;
}) {
  return (
    <span
      className={[
        "absolute bottom-0 right-0 text-xs bg-white",
        className,
        value < maxLength * 0.1
          ? "opacity-0"
          : value < maxLength * 0.5
          ? "opacity-25"
          : value < maxLength * 0.9
          ? "opacity-50"
          : value < maxLength
          ? "opacity-75"
          : "opacity-100 text-contrast",
      ].join(" ")}
    >{`${value}/${maxLength}`}</span>
  );
}
