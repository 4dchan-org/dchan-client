import { Footer, Card, BoardList, GenericHeader } from "src/components";
import { BOARDS_SEARCH } from "src/subgraph/graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from "react-router-dom";
import { Router } from "src/router";

export const BoardSearchPage = () => {
  const { boardName: name } = useParams()
  const { data } = useQuery(BOARDS_SEARCH, {
    variables: { name },
    pollInterval: 30_000,
  });

  return (
    <div className="bg-primary min-h-100vh flex flex-col">
      <GenericHeader
        title="Boards"
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
