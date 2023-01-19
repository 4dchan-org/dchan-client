import { Footer, Card, BoardList, GenericHeader } from "dchan/components";
import { BOARDS_SEARCH } from "dchan/subgraph/graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { Router } from "router";

export const BoardSearchPage = ({
  match: {
    params: { boardName: name },
  },
}: any) => {
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
