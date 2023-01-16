import { useLocation } from "react-router";
import { HashLink } from "react-router-hash-link";

export default function Anchor({
  label,
  to,
  onClick
}: {
  label: string
  to: string,
  onClick?: any
}) {
  const search = useLocation().search;
  
  return (
    <div>
      [
      <HashLink
        className="dchan-link"
        to={`${search}${to}`}
        onClick={onClick}
      >
        {label}
      </HashLink>
      ]
    </div>
  );
}
