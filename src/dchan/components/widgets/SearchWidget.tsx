import { useCallback, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";

export const SearchWidget = ({
  search = "",
  open = true,
  onSearch = () => {}
}: {
  baseUrl: string;
  search?: string;
  open?: boolean;
  onSearch?: (search: string) => void
}) => {
  const [displayInput, setDisplayInput] = useState<string>(search || "");
  const setSearch = useCallback(
    (search: string) => {
      setDisplayInput(search)
    },
    [setDisplayInput]
  );

  const inputRef = useRef(null)

  const resetSearch = useCallback(() => {
    setSearch("");
    if(!!inputRef?.current) {
      (inputRef as any).current.value = ""
    }
  }, [setSearch]);

  const onSearchDebounce = useMemo(
    () => debounce(onSearch, 500),
    [onSearch]
  );

  const onChange = useCallback(
    (e: any) => {
      const search = e.target.value
      setDisplayInput(search);
      onSearchDebounce(search);
    },
    [onSearchDebounce]
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
