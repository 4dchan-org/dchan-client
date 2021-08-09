export type SetStatus = React.Dispatch<React.SetStateAction<any>>

export default function Status({ status, className = ""}: { status: any, className?: string }) {
  return (
    <div className={className + " inline-block text-xs"}>
      {status ? (
        status.error ? (
          <div className="text-red-600">
            <details>
              <summary>Error</summary>
              <pre>{JSON.stringify(status.error, null, 2)}</pre>
            </details>
          </div>
        ) : (
          status
        )
      ) : (
        ""
      )}
    </div>
  );
}
