import { User } from "src/subgraph/types";
import { IdLabel } from ".";

export const UserLabel = ({
  user,
  className = "",
}: {
  className?: string;
  user: User;
}) => {
  return (
    <a
      className="dchan-link"
      href={`https://polygonscan.com/address/${user.address}`}
      target={`_blank`}
    >
      <IdLabel id={user.address || "0x000000"} className={className}>
        {user.b58id}
      </IdLabel>
    </a>
  );
};
