import { Footer, Card } from "components";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import { BOARDS_SEARCH } from "graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { parse as parseQueryString } from "query-string";
import { Router } from "router";

export default function BoardListPage({
  location,
  match: {
    params: { boardName: name },
  },
}: any) {
  const query = parseQueryString(location.search);
  const { data } = useQuery(BOARDS_SEARCH, {
    variables: { name },
    pollInterval: 30_000,
  });

  return (
    <div className="bg-primary min-h-100vh flex flex-col">
      <GenericHeader
        title="Boards"
        block={query.block ? `${query.block}` : undefined}
      />

      <Link className="dchan-link py-1 px-4" to={Router.boards()}>
        All boards
      </Link>
      <div className="center flex">
        <Card title={<span>{`/${name}/`}</span>} className="pt-4">
          <BoardList boards={data?.boards}></BoardList>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
