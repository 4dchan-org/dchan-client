import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import Card from "components/Card";
import Loading from "components/Loading";
import BOARDS_LIST from "dchan/graphql/queries/boards/list";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BoardCreationForm from "components/BoardCreationForm";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars { }

export default function BoardListPage() {
  const { query } = {
    query: BOARDS_LIST,
  };

  const { loading, data } = useQuery<BoardListData, BoardListVars>(query, {});

  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Boards"></GenericHeader>
      {loading ? (
        <div className="center grid">
          <Loading></Loading>
        </div>
      ) : (
        <div>
          <div className="center flex">
            <div>
              <Card
                title={<span>Most popular</span>}
                body={<BoardList boards={data?.mostPopular}></BoardList>}
              />
            </div>
          </div>
          <div className="center flex flex-wrap">
            <span className="px-2">
              <Card
                title={<span>Last created</span>}
                body={<BoardList boards={data?.lastCreated}></BoardList>}
              />
            </span>
            <span className="px-2">
              <Card
                title={<span>Last bumped</span>}
                body={<BoardList boards={data?.lastBumped}></BoardList>}
              />
            </span>
          </div>
          <div className="center flex">
            <div>
              <BoardCreationForm />
            </div>
          </div>

          <Footer></Footer>
        </div>
      )}
    </div>
  );
}
