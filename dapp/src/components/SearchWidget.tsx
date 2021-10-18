import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export default function SearchWidget({
  baseUrl,
  search,
}: {
  baseUrl: string;
  search?: string;
}) {
  const history = useHistory();
  const setSearch = useCallback(
    (search: string) => {
      history.push(`${baseUrl}${search ? `?s=${search}` : ``}`);
    },
    [history, baseUrl]
  );

  return (
    <div className="mx-1 text-center bg-primary border border-secondary-accent p-1">
      <div>Search:</div>
      <div>
        <input
          id="dchan-search"
          className="text-center w-32"
          type="text"
          placeholder="..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={true}
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
  );
}
