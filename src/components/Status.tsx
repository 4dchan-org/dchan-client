import isString from "lodash/isString";
import { Spinner } from ".";

export type SetStatus = React.Dispatch<React.SetStateAction<any>>;

export const Status = ({
  status,
  className = "",
}: {
  status: any;
  className?: string;
}) => {
  return status ? (
    <div className={className + " inline-block text-xs"}>
      <div className="bg-secondary px-1 border border-black">
        {status.error ? (
          <div className="text-red-600">
            <details>
              <summary>Error</summary>
              <pre className="whitespace-pre-wrap max-w-32rem mt-2">
                {status.error.message
                  ? status.error.message
                  : JSON.stringify(status.error, null, 2)}
              </pre>
            </details>
          </div>
        ) : status.progress ? (
          <div className="text-gray-900 flex center">
            <Spinner size={4} speed={"faster"} />
            <span className="px-2">{status.progress}</span>
          </div>
        ) : status.success ? (
          <div className="text-green-600">
            <span className="px-2">{status.success}</span>
          </div>
        ) : isString(status) ? (
          status
        ) : JSON.stringify(status) === "{}" ? "No tx result returned by wallet, but it likely went through successfully." : JSON.stringify(status)}
      </div>
    </div>
  ) : (
    <span></span>
  );
}
