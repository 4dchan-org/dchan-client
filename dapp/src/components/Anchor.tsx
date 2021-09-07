import { HashLink } from "react-router-hash-link";

export default function Anchor({
  label,
  to
}: {
  label: string
  to: string
}) {
  return (
    <div>
      [
      <HashLink
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
        to={to}
      >
        {label}
      </HashLink>
      ]
    </div>
  );
}
