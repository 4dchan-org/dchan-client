import {
  Footer,
  Card,
  Loading,
  BoardCreationForm,
  SearchWidget,
  BoardTabs,
  BoardList,
  GenericHeader
} from "dchan/components";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan/subgraph/types";
import { parse as parseQueryString } from "query-string";
import { isString, uniqBy } from "lodash";
import { Router } from "router";
import { useEffect } from "react";
import { BOARDS_SEARCH, BOARDS_SEARCH_BLOCK } from "dchan/subgraph/graphql/queries";
import useTimeTravel from "dchan/hooks/useTimeTravel";

interface BoardSearchData {
  searchByName: Board[];
  searchByTitle: Board[];
}

interface BoardSearchVars {
  searchName: string;
  searchTitle: string;
  block?: number;
}

export const BoardListPage = ({ location, match: { params } }: any) => {
  const query = parseQueryString(location.search);
  const search =
    `${params?.board_name || ""}` || (isString(query.s) ? query.s : "");
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const {
    refetch: searchRefetch,
    data: searchData,
    loading: searchLoading,
  } = useQuery<BoardSearchData, BoardSearchVars>(
    block ? BOARDS_SEARCH_BLOCK : BOARDS_SEARCH,
    {
      pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
      variables: {
        searchName: search,
        searchTitle: search.length > 1 ? `${search}:*` : "",
        block,
      },
      skip: !search,
    }
  );

  useEffect(() => {
    searchRefetch();
  }, [search, searchRefetch]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [search]);

  const searchResults =
    searchData && (searchData.searchByTitle || searchData.searchByName)
      ? uniqBy([...searchData.searchByName, ...searchData.searchByTitle], "id")
      : [];

  return (
    <div className="bg-primary min-h-100vh flex flex-col">
      <GenericHeader
        title="Boards"
      />

      <div className="relative">
        <div className="flex center">
          <SearchWidget
            baseUrl={`${Router.boards()}${
              block ? `?block=${block}` : ""
            }`}
            search={search}
          />
        </div>
        <div className="">
          {searchLoading ? (
            <div className="center grid">
              <Loading></Loading>
            </div>
          ) : search ? (
            <div className="center flex">
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <Card
                    title={<span>Results for "{search}"</span>}
                    className="pt-4"
                  >
                    <BoardList boards={searchResults} />
                  </Card>
                ) : (
                  "No boards found"
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid pt-2 justify-center">
                <BoardTabs />
              </div>
            </>
          )}
          <div className="center flex sticky bottom-0">
            <div className="">
              <BoardCreationForm />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
