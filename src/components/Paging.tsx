import { Link, useNavigate } from "react-router-dom";
import { useTimeTravel } from "src/hooks";

export const Paging = ({ url, page, maxPage, hasNextPage }: {
  url: string,
  page: number,
  maxPage?: number,
  hasNextPage?: boolean
}) => {
  const navigate = useNavigate();
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  return (
    <div className="p-2">
      <span>
        <Link
          className={`dchan-link px-2 ${page > 1 ?  "" : "dchan-link-disabled"}`}
          to={`${url}${url.indexOf("?") === -1 ? "?" : "&"}page=1${block ? `&block=${block}` : ""}`}
        >
          &lt;&lt;
        </Link>
      </span>
      <span>
        <Link
          className={`dchan-link px-2 ${page > 1 ?  "" : "dchan-link-disabled"}`}
          to={`${url}${url.indexOf("?") === -1 ? "?" : "&"}page=${page - 1}${block ? `&block=${block}` : ""}`}
        >
          &lt;
        </Link>
      </span>
      <span>
        [
        <button
          className="dchan-link px-2"
          onClick={() => {
            const input = prompt(`Page number: ${maxPage ? `(range: 1-${maxPage})` : ``}`);
            if (input != null) {
              const newPage = parseInt(input || "");
              if (isNaN(newPage) || newPage < 1 || (maxPage && newPage > maxPage)) {
                alert(`Invalid page number: ${input}`);
              } else {
                navigate(
                  `${url}${url.indexOf("?") === -1 ? "?" : "&"}page=${newPage}${block ? `&block=${block}` : ""}`
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
            hasNextPage === true || (maxPage && page < maxPage) ? "" : "dchan-link-disabled"
          }`}
          to={`${url}${url.indexOf("?") === -1 ? "?" : "&"}page=${page + 1}${block ? `&block=${block}` : ""}`}
        >
          &gt;
        </Link>
      </span>
      <span>
        <Link
          className={`dchan-link px-2 ${
            hasNextPage === true && (maxPage && page < maxPage) ? "" : "dchan-link-disabled"
          }`}
          to={`${url}${url.indexOf("?") === -1 ? "?" : "&"}page=${maxPage}${block ? `&block=${block}` : ""}`}
        >
          &gt;&gt;
        </Link>
      </span>
    </div>
  );
}
