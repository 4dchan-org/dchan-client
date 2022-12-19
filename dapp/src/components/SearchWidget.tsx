import { useCallback, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { debounce } from "lodash";

export default function SearchWidget({
  baseUrl,
  search = "",
  open = true
}: {
  baseUrl: string;
  search?: string;
  open?: boolean
}) {
  const history = useHistory();
  const [displayInput, setDisplayInput] = useState<string>(search || "");
  const setSearch = useCallback(
    (search: string) => {
      const newUrl = search
        ? baseUrl.includes("?")
          ? `${baseUrl}&s=${search}`
          : `${baseUrl}?s=${search}`
        : baseUrl;
      history.push(newUrl);
    },
    [history, baseUrl]
  );

  const inputRef = useRef(null)

  const resetSearch = useCallback(() => {
    setSearch("");
    console.log({inputRef})
    if(!!inputRef?.current) {
      (inputRef as any).current.value = ""
    }
  }, [setSearch]);

  const setSearchDebounce = useMemo(
    () => debounce(setSearch, 500),
    [setSearch]
  );

  const onChange = useCallback(
    (e) => {
      const search = e.target.value
      setDisplayInput(search);
      setSearchDebounce(search);
    },
    [setSearchDebounce]
  );

  return (
    <details className="grid center self-center bg-secondary border border-secondary-accent p-1" open={open}>
      <summary>Search</summary>
      <div>
        <input
          id={`dchan-search`}
          className="text-center w-32"
          ref={inputRef}
          type="text"
          placeholder="..."
          value={displayInput}
          onChange={onChange}
          autoFocus={true}
        ></input>
      </div>
      <div className="relative">
        {search ? (
          <span className="text-xs">
            [
            <button className="dchan-link" onClick={resetSearch}>
              Cancel
            </button>
            ]
          </span>
        ) : (
          ""
        )}
      </div>
    </details>
  );
}
