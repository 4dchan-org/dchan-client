import { useQuery } from "@apollo/react-hooks";
import { Post } from "dchan";
import { isLowScore, sortByCreatedAt } from "dchan/entities/post";
import POST_SEARCH from "dchan/graphql/queries/post_search";
import useSettings from "hooks/useSettings";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import FilterSettings from "./FilterSettings";
import IdLabel from "./IdLabel";
import PostView from "./post/Post";

interface SearchData {
  postSearch: Post[]
}
interface SearchVars {
  block: number;
  search: string;
}

export default function SearchResultsView({ search, block }: { search: string, block: number }) {
  const [settings] = useSettings();

  const variables = {
    block,
    search: search.length > 1 ? `${search}:*` : "",
  };

  const { refetch, data } = useQuery<SearchData, SearchVars>(
    POST_SEARCH,
    {
      variables,
      pollInterval: 60_000,
    }
  );

  const postSearch = data?.postSearch;

  const results = useMemo(() => {
    return sortByCreatedAt(
      postSearch
        ? postSearch.filter((post) => {
            return post && post.thread && post.board;
          })
        : []
    );
  }, [postSearch]);

  useEffect(() => {
    refetch();
  }, [search, block, refetch]);

  return (
    <div>
      {results && results.length ? (
        <div>
          <div className="text-center">
            <FilterSettings
              summary={
                <span>
                  Found: {results.length} posts (Hidden:{" "}
                  {
                    results.filter((p) =>
                      isLowScore(p, settings?.content?.score_threshold)
                    ).length
                  }
                  )
                </span>
              }
            />
          </div>
          <div>
            {results?.map((post) => (
              <div className="p-2 flex flex-wrap">
                <PostView
                  key={post.id}
                  post={post}
                  header={
                    <span>
                      <span className="p-1">
                        [
                        <span className="p-1">
                          <Link
                            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                            to={`/${post.board?.name}/${post.board?.id}`}
                          >
                            /{post.board?.name}/
                            <IdLabel
                              id={post.board?.id || "0x000000"}
                            ></IdLabel>
                          </Link>
                        </span>
                        ]
                      </span>
                      <span className="p-1">
                        [
                        <Link
                          to={`/${post.id}`}
                          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                        >
                          View
                        </Link>
                        ]
                      </span>
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        "No results"
      )}
    </div>
  );
}
