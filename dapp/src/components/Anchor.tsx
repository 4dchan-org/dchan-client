import { useLocation } from "react-router";
import { HashLink } from "react-router-hash-link";

export default function Anchor({
  label,
  to
}: {
  label: string
  to: string
}) {
  const search = useLocation().search;
  
  return (
    <div>
      [
      <HashLink
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
        to={`${search}${to}`}
      >
        {label}
      </HashLink>
      ]
    </div>
  );
}
