import { Link } from "react-router-dom";
import { BackButton } from ".";

export const SimpleFooter = () => {
  return (
    <div className="p-4">
      <div>
        <BackButton />
      </div>
      <div>
        <Link
          className="block dchan-link"
          to="/"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
