import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export default function SearchWidget({
  baseUrl,
  search
}: {
  baseUrl: string;
  search: string;
}) {
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(!!search)
  const setSearch = useCallback((search: string) => {
    console.log({search})
    history.push(`${baseUrl}${search ? `?s=${search}` : ``}`);
  }, [history, baseUrl]);
  const onClick = useCallback(() => setOpen(true), [setOpen])

  return (
    <details open={open}>
      <summary>
        <label htmlFor="dchan-search" onClick={onClick}>🔍</label>
      </summary>
      <div className="mx-1 text-center bg-primary">
        <div>Search:</div>
        <div>
          <input
            id="dchan-search"
            className="text-center w-32"
            type="text"
            placeholder="..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        <div className="relative">
          {search ? (
            <span className="text-xs">
              [
              <button
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                onClick={() => setSearch("")}
              >
                Cancel
              </button>
              ]
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </details>
  );
}
