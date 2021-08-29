import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function SearchWidget({ baseUrl, search, setSearch }: {baseUrl: string, search: string, setSearch: any}) {
  const history = useHistory()
  const onSearchChange = useCallback(
    (e: any) => setSearch(e.target.value),
    [setSearch]
  );
  
  useEffect(() => {
    console.log({search})
    history.replace(`${baseUrl}${search ? `?s=${search}` : ""}`)
  }, [baseUrl, search, history]);

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
