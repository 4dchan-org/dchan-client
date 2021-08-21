import { Link } from "react-router-dom";
import BackButton from "./BackButton";

export default function SimpleFooter() {
  return (
    <div className="p-4">
      <div>
        <BackButton />
      </div>
      <div>
        <Link
          className="block text-blue-600 visited:text-purple-600 hover:text-blue-500"
          to="/"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
