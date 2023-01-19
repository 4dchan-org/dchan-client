import useTimeTravel from "dchan/hooks/useTimeTravel";
import { Link, useHistory } from "react-router-dom";

export const Paging = ({ url, page, maxPage }: any) => {
  const history = useHistory();
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  return (
    <div className="p-2">
      <span>
        <Link
          className={`dchan-link px-2 ${page > 1 ?  "" : "dchan-link-disabled"}`}
          to={`${url}?page=1${block ? `&block=${block}` : ""}`}
        >
          &lt;&lt;
        </Link>
      </span>
      <span>
        <Link
          className={`dchan-link px-2 ${page > 1 ?  "" : "dchan-link-disabled"}`}
          to={`${url}?page=${page - 1}${block ? `&block=${block}` : ""}`}
        >
          &lt;
        </Link>
      </span>
      <span>
        [
        <button
          className="dchan-link px-2"
          onClick={() => {
            const input = prompt(`Page number: (range: 1-${maxPage})`);
            if (input != null) {
              const newPage = parseInt(input || "");
              if (isNaN(newPage) || newPage < 1 || newPage > maxPage) {
                alert(`Invalid page number: ${input}`);
              } else {
                history.push(
                  `${url}?page=${newPage}${block ? `&block=${block}` : ""}`
                );
              }
            }
          }}
        >
          Page {page}
          {maxPage ? ` of ${maxPage}` : ``}
        </button>
        ]
      </span>
      <span>
        <Link
          className={`dchan-link px-2 ${
            !maxPage || page < maxPage ? "" : "dchan-link-disabled"
          }`}
          to={`${url}?page=${page + 1}${block ? `&block=${block}` : ""}`}
        >
          &gt;
        </Link>
      </span>
      <span>
        <Link
          className={`dchan-link px-2 ${
            maxPage && page < maxPage ? "" : "dchan-link-disabled"
          }`}
          to={`${url}?page=${maxPage}${block ? `&block=${block}` : ""}`}
        >
          &gt;&gt;
        </Link>
      </span>
    </div>
  );
}
