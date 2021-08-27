import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import Card from "components/Card";
import BOARDS_SEARCH from "dchan/graphql/queries/boards/search";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

export default function BoardListPage({
  match: {
    params: { boardName: name },
  },
}: any) {
  const { data } = useQuery(BOARDS_SEARCH, { variables: { name }, pollInterval: 30_000 });

  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Boards"></GenericHeader>

      <Link
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4"
        to="/_/boards"
      >
        All boards
      </Link>
      <div className="center flex">
        <Card
          title={<span>{`/${name}/`}</span>}
          body={<BoardList boards={data?.boards}></BoardList>}
        />
      </div>

      <Footer></Footer>
    </div>
  );
}
