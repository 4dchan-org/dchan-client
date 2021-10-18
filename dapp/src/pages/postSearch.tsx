import Footer from "components/Footer";
import useLastBlock from "hooks/useLastBlock";
import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { DateTime } from "luxon";
import ContentHeader from "components/ContentHeader";
import useSettings from "hooks/useSettings";
import { useQuery } from "@apollo/react-hooks";
import { useEffect, useMemo } from "react";
import { isLowScore, sortByCreatedAt } from "dchan/entities/post";
import POST_SEARCH from "graphql/queries/post_search";
import { Post } from "dchan";
import PostComponent from "components/post/Post";
import { Link } from "react-router-dom";
import IdLabel from "components/IdLabel";
import { Router } from "router";
import Loading from "components/Loading";

interface SearchData {
  postSearch: Post[];
}
interface SearchVars {
  block: number;
  search: string;
}

export default function PostSearchPage({ location, match: { params } }: any) {
  const query = parseQueryString(location.search);
  const s = query.s || query.search;
  const search = isString(s) ? s : "";

  const { lastBlock } = useLastBlock();

  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;
  const block = parseInt(`${query.block || lastBlock?.number || ""}`);
  const isTimeTraveling = query.block && `${query.block}` !== lastBlock?.number;
  const [settings] = useSettings();

  const variables = {
    block,
    search: search.length > 1 ? `${search}:*` : "",
  };

  const { refetch, data, loading } = useQuery<SearchData, SearchVars>(
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
    <div className="bg-primary min-h-100vh" data-theme={"blueboard"}>
      <ContentHeader
        dateTime={dateTime}
        search={search}
        baseUrl={Router.posts()}
        block={isTimeTraveling ? `${block}` : undefined}
        summary={
          results ? (
            <span>
              Found: {results.length} posts (Hidden:{" "}
              {
                results.filter((p) =>
                  isLowScore(p, settings?.content_filter?.score_threshold)
                ).length
              }
              )
            </span>
          ) : (
            <span>...</span>
          )
        }
        onRefresh={refetch}
      />

      <div>
        {loading ? (
          <div className="center grid">
            <Loading />
          </div>
        ) : results && results.length ? (
          <div>
            <div>
              {results?.map((post) => (
                <div className="p-2 flex flex-wrap">
                  <PostComponent
                    key={post.id}
                    post={post}
                    block={isTimeTraveling ? `${block}` : undefined}
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

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
