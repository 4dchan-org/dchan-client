import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { BackButton, Card } from ".";

export const Error = ({
  subject,
  children,
}: {
  subject: string;
  children: ReactElement;
}) => {
  return (
    <div className="font-family-arial text-center">
      <div className="grid center min-h-100vh">
        <div>
          <Card
            title={
              <div className="text-xl text-contrast font-weight-800 font-family-tahoma m-4">
                {subject}
              </div>
            }
          >
            <div className="grid center m-4">{children}</div>
          </Card>
          <div>
            <BackButton />
          </div>
          <div>
            <Link className="dchan-link m-4" to="/">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
