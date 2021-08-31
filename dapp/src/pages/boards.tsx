import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import Card from "components/Card";
import Loading from "components/Loading";
import BOARDS_LIST from "dchan/graphql/queries/boards/list";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BoardCreationForm from "components/BoardCreationForm";
import SearchWidget from "components/SearchWidget";
import { parse as parseQueryString } from "query-string";
import { isString, uniqBy } from "lodash";
import { Router } from "router";

interface BoardListData {
  searchByName: Board[];
  searchByTitle: Board[];
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars {}

export default function BoardListPage({ location }: any) {
  const query = parseQueryString(location.search);
  const search = isString(query.s) ? query.s : ""
  
  const { loading, data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST,
    {
      pollInterval: 30_000,
      variables: {
        searchName: search,
        searchTitle: search.length > 1 ? `${search}:*` : "",
      },
    }
  );

  const searchResults =
    data && (data.searchByTitle || data.searchByName)
      ? uniqBy([...data.searchByName, ...data.searchByTitle], 'id')
      : [];
  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Boards"></GenericHeader>
      <div>
        <div>
          <div className="flex center">
            <SearchWidget baseUrl={Router.boards()} search={search} />
          </div>
          {loading ? (
            <div className="center grid">
              <Loading></Loading>
            </div>
          ) : search ? (
            <div className="center flex">
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <Card
                    title={<span>Results for "{search}"</span>}
                    body={<BoardList boards={searchResults} />}
                  />
                ) : (
                  "No boards found"
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="center flex">
                <div>
                  <Card
                    title={<span>Most popular</span>}
                    body={<BoardList boards={data?.mostPopular} />}
                  />
                </div>
              </div>
              <div className="center flex flex-wrap">
                <span className="px-2">
                  <Card
                    title={<span>Last created</span>}
                    body={<BoardList boards={data?.lastCreated} />}
                  />
                </span>
                <span className="px-2">
                  <Card
                    title={<span>Last bumped</span>}
                    body={<BoardList boards={data?.lastBumped} />}
                  />
                </span>
              </div>
              <div className="center flex">
                <div>
                  <BoardCreationForm />
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer></Footer>
      </div>
    </div>
  );
}
