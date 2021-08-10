import Loading from "./Loading";
import Spinner from "./Spinner";

export type SetStatus = React.Dispatch<React.SetStateAction<any>>;

export default function Status({
  status,
  className = "",
}: {
  status: any;
  className?: string;
}) {
  return (
    <div className={className + " inline-block text-xs"}>
      {status ? (
        <div className="bg-secondary px-1 border border-black">
          {status.error ? (
            <div className="text-red-600">
              <details>
                <summary>Error</summary>
                <pre>{JSON.stringify(status.error, null, 2)}</pre>
              </details>
            </div>
          ) : status.progress ? (
            <div className="text-gray-900 flex center">
              <Spinner size={4} speed={"faster"}></Spinner>
              <span className="px-2">{status.progress}</span>
            </div>
          ) : status.success ? (
            <div className="text-green-600">
              <span className="px-2">{status.success}</span>
            </div>
          ) : (
            status
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
