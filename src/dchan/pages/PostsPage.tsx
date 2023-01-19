import { parse as parseQueryString } from "query-string";
import { isString } from "lodash";
import { useSettings } from "dchan/hooks";
import { useQuery } from "@apollo/react-hooks";
import { useEffect, useMemo } from "react";
import { isLowScore, sortByCreatedAt } from "dchan/subgraph/entities/post";
import { POST_SEARCH, POST_SEARCH_BLOCK } from "dchan/subgraph/graphql/queries";
import { Post } from "dchan/subgraph/types";
import { Link } from "react-router-dom";
import { Router } from "router";
import {
  Footer,
  ContentHeader,
  IdLabel,
  Loading,
  SearchWidget,
  LatestPostsCard,
  Post as PostComponent,
  Paging
} from "dchan/components";
import useTimeTravel from "dchan/hooks/useTimeTravel";

interface SearchData {
  postSearch: Post[];
}
interface SearchVars {
  block?: number;
  search: string;
}

export const PostsPage = ({ location, match: { params } }: any) => {
  const query = parseQueryString(location.search);
  const s = query.s || query.search;
  const search = isString(s) ? s : "";
  const page = parseInt(`${query.page || "1"}`);
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const [settings] = useSettings();

  const variables = {
    block,
    search: search.length > 1 ? `${search}:*` : "*:*",
  };

  const { refetch, data, loading } = useQuery<SearchData, SearchVars>(
    block ? POST_SEARCH_BLOCK : POST_SEARCH,
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
    window.scrollTo({ top: 0 });
  }, [search]);

  useEffect(() => {
    refetch();
  }, [search, block, refetch]);

  return (
    <div
      className="bg-primary min-h-100vh flex flex-col"
      data-theme={"blueboard"}
    >
      <ContentHeader
        board={null}
        title="Posts"
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
      <div className="relative">
        <div className="flex justify-center md:justify-start p-2">
          <SearchWidget
            baseUrl={`${Router.posts()}${
              block ? `?block=${block}` : ""
            }`}
            search={search}
            open={true}
          />
          <span className="grid center bg-secondary border border-secondary-accent mx-2">
            {!loading ? <Paging page={page} url={Router.posts()} /> : <span/>}
          </span>
        </div>

        <div className="p-2">
          <hr></hr>
        </div>

        {loading ? (
          <div className="center grid">
            <Loading />
          </div>
        ) : results && results.length ? (
          <div>
            <div>
              {results?.map((post) => (
                <div className="p-2 flex flex-wrap" key={post.id}>
                  <PostComponent
                    key={post.id}
                    post={post}
                    header={
                      <span>
                        <span className="p-1">
                          [
                          <span className="p-1">
                            <Link
                              className="dchan-link"
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
                          <Link to={`/${post.id}`} className="dchan-link">
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
            <Paging page={page} url={Router.posts()} />
          </div>
        ) : !!search ? (
          <div className="py-4">No results</div>
        ) : (
          <div>
            <LatestPostsCard limit={25} skip={page > 1 ? page * 25 : 0} />
            <Paging page={page} url={Router.posts()} />
          </div>
        )}
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
