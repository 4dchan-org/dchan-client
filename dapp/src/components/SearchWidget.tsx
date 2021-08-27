import { useCallback } from "react";

export default function SearchWidget({ search, setSearch }: any) {
  const onSearchChange = useCallback(
    (e: any) => setSearch(e.target.value),
    [setSearch]
  );

  return (
    <div className="mx-1 text-center">
      <div className="relative">
        <label htmlFor="search">Search: </label>
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
      <div>
        <input
          id="search"
          className="text-center w-32"
          type="text"
          placeholder="..."
          value={search}
          onChange={onSearchChange}
        ></input>
      </div>
    </div>
  );
}
