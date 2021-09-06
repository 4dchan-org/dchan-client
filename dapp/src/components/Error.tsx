import { ReactElement } from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";

export default function Error({
  subject,
  children,
}: {
  subject: string;
  children: ReactElement
}) {
  return (
    <div className="font-family-arial text-center">
      <div className="grid center min-h-100vh">
        <div>
          <div className="text-4xl text-contrast font-weight-800 font-family-tahoma m-4">
            {subject}
          </div>
          <div className="grid center m-4">{children}</div>
          <div>
            <BackButton />
          </div>
          <div>
            <Link className="text-blue-600 visited:text-purple-600 m-4" to="/">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
