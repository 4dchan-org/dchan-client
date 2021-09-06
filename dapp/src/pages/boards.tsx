import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import Card from "components/Card";
import Loading from "components/Loading";
import BOARDS_LIST from "graphql/queries/boards/list";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BoardCreationForm from "components/BoardCreationForm";
import SearchWidget from "components/SearchWidget";
import { parse as parseQueryString } from "query-string";
import { isString, uniqBy } from "lodash";
import { Router } from "router";
import { useEffect } from "react";
import BOARDS_SEARCH from "graphql/queries/boards/search";

interface BoardSearchData {
  searchByName: Board[];
  searchByTitle: Board[];
}

interface BoardSearchVars {
  searchName: string;
  searchTitle: string;
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

  const {
    refetch: searchRefetch,
    data: searchData,
    loading: searchLoading,
  } = useQuery<BoardSearchData, BoardSearchVars>(BOARDS_SEARCH, {
    pollInterval: 30_000,
    variables: {
      searchName: search,
      searchTitle: search.length > 1 ? `${search}:*` : "",
    },
    skip: !search,
  });

  const { data: boardsData, loading: boardsLoading } = useQuery<
    BoardListData,
    BoardListVars
  >(BOARDS_LIST, {
    pollInterval: 30_000,
  });

  useEffect(() => {
    searchRefetch();
  }, [search, searchRefetch]);

  const searchResults =
    searchData && (searchData.searchByTitle || searchData.searchByName)
      ? uniqBy([...searchData.searchByName, ...searchData.searchByTitle], "id")
      : [];

  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Boards"></GenericHeader>
      <div>
        <div>
          <div className="flex center">
            <SearchWidget baseUrl={Router.boards()} search={search} />
          </div>
          {searchLoading || boardsLoading ? (
            <div className="center grid">
              <Loading></Loading>
            </div>
          ) : search ? (
            <div className="center flex">
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <Card title={<span>Results for "{search}"</span>}>
                    <BoardList boards={searchResults} />
                  </Card>
                ) : (
                  "No boards found"
                )}
              </div>
            </div>
          ) : boardsData ? (
            <div>
              <div className="center flex">
                <div>
                  <Card title={<span>Most popular</span>}>
                    <BoardList boards={boardsData.mostPopular} />
                  </Card>
                </div>
              </div>
              <div className="center flex flex-wrap">
                <span className="px-2">
                  <Card title={<span>Last created</span>}>
                    <BoardList boards={boardsData.lastCreated} />
                  </Card>
                </span>
                <span className="px-2">
                  <Card title={<span>Last bumped</span>}>
                    <BoardList boards={boardsData.lastBumped} />
                  </Card>
                </span>
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

        <Footer></Footer>
      </div>
    </div>
  );
}
