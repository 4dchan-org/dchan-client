import {
  Footer,
  Card,
  Loading,
  BoardCreationForm,
  SearchWidget,
  BoardTabs,
} from "components";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "services/dchan/types";
import { parse as parseQueryString } from "query-string";
import { isString, uniqBy } from "lodash";
import { Router } from "router";
import { useEffect } from "react";
import { BOARDS_SEARCH, BOARDS_SEARCH_BLOCK } from "graphql/queries";
import { DateTime } from "luxon";

interface BoardSearchData {
  searchByName: Board[];
  searchByTitle: Board[];
}

interface BoardSearchVars {
  searchName: string;
  searchTitle: string;
  block?: number;
}

export default function BoardListPage({ location, match: { params } }: any) {
  const query = parseQueryString(location.search);
  const search =
    `${params?.board_name || ""}` || (isString(query.s) ? query.s : "");
  const block = parseInt(`${query.block}`);
  const queriedBlock = isNaN(block) ? undefined : block;
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  const {
    refetch: searchRefetch,
    data: searchData,
    loading: searchLoading,
  } = useQuery<BoardSearchData, BoardSearchVars>(
    block ? BOARDS_SEARCH_BLOCK : BOARDS_SEARCH,
    {
      pollInterval: 30_000,
      fetchPolicy: queriedBlock ? "cache-first" : "network-only",
      variables: {
        searchName: search,
        searchTitle: search.length > 1 ? `${search}:*` : "",
        block: queriedBlock,
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
        baseUrl={`${Router.boards()}${search ? `?s=${search}` : ""}`}
        block={queriedBlock ? `${queriedBlock}` : undefined}
        dateTime={dateTime}
      />
      <div className="relative">
        <div className="flex center">
          <SearchWidget
            baseUrl={`${Router.boards()}${
              queriedBlock ? `?block=${queriedBlock}` : ""
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
                    <BoardList boards={searchResults} block={queriedBlock} />
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
