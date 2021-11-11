import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import Card from "components/Card";
import Loading from "components/Loading";
import { useQuery, WatchQueryFetchPolicy } from "@apollo/react-hooks";
import { Board } from "dchan";
import BoardCreationForm from "components/BoardCreationForm";
import SearchWidget from "components/SearchWidget";
import { parse as parseQueryString } from "query-string";
import { isString, uniqBy } from "lodash";
import { Router } from "router";
import { useEffect } from "react";
import BOARDS_LIST from "graphql/queries/boards/list";
import BOARDS_LIST_BLOCK from "graphql/queries/boards/list_block";
import BOARDS_SEARCH from "graphql/queries/boards/search";
import BOARDS_SEARCH_BLOCK from "graphql/queries/boards/search";
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

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars {}

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
  } = useQuery<BoardSearchData, BoardSearchVars>(block ? BOARDS_SEARCH_BLOCK : BOARDS_SEARCH, {
    pollInterval: 30_000,
    fetchPolicy: queriedBlock ? "cache-first" : "network-only",
    variables: {
      searchName: search,
      searchTitle: search.length > 1 ? `${search}:*` : "",
      block: queriedBlock,
    },
    skip: !search,
  });

  const { data: boardsData, loading: boardsLoading } = useQuery<
    BoardListData,
    BoardListVars
  >(block ? BOARDS_LIST_BLOCK : BOARDS_LIST, {
    pollInterval: 30_000,
    fetchPolicy: queriedBlock ? "cache-first" : "network-only",
    variables: {block: queriedBlock}
  });

  useEffect(() => {
    searchRefetch();
  }, [search, searchRefetch]);

  useEffect(() => {
    window.scrollTo({top: 0})
  }, [search])

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
      <div>
        <div className="flex center">
          <SearchWidget baseUrl={`${Router.boards()}${queriedBlock ? `?block=${queriedBlock}` : ""}`} search={search} />
        </div>
        {searchLoading || boardsLoading ? (
          <div className="center grid">
            <Loading></Loading>
          </div>
        ) : search ? (
          <div className="center flex">
            <div className="p-2">
              {searchResults.length > 0 ? (
                <Card title={<span>Results for "{search}"</span>} className="pt-4">
                  <BoardList boards={searchResults} block={queriedBlock} />
                </Card>
              ) : (
                "No boards found"
              )}
            </div>
          </div>
        ) : boardsData ? (
          <div>
            <div className="grid justify-center">
              <Card title={<span>Most popular</span>} className="pt-4">
                <BoardList boards={boardsData.mostPopular} block={queriedBlock} />
              </Card>
              <Card title={<span>Last created</span>} className="pt-4">
                <BoardList boards={boardsData.lastCreated} block={queriedBlock} />
              </Card>
              <Card title={<span>Last bumped</span>} className="pt-4">
                <BoardList boards={boardsData.lastBumped} block={queriedBlock} />
              </Card>
            </div>
            <div className="center flex">
              <div>
                <BoardCreationForm />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <Footer />
    </div>
  );
}
