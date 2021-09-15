import { HashLink } from "react-router-hash-link";

export default function Anchor({
  label,
  to
}: {
  label: string
  to: string
}) {
  return (
    <div style={{margin: "2px"}}>
      [
      <HashLink
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
        to={to}
        style={{fontSize: "15px", padding: "4px"}}
      >
        {label}
      </HashLink>
      ]
    </div>
  );
}
