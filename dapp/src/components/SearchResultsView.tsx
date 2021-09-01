import { Post } from "dchan";
import { isLowScore } from "dchan/entities/post";
import useSettings from "hooks/useSettings";
import { Link } from "react-router-dom";
import FilterSettings from "./FilterSettings";
import IdLabel from "./IdLabel";
import PostView from "./post/Post";

export default function SearchResultsView({ results }: { results?: Post[] }) {
  const [settings] = useSettings();

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
