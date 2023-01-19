import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "dchan/subgraph/graphql/fragments/board";

export const BOARDS_SEARCH = gql`
  ${BOARD_FRAGMENT}

  query BoardsSearch($searchName: String!, $searchTitle: String!) {
    searchByTitle: boardSearch(text: $searchTitle) {
      ...Board
    }
    searchByName: boards(where: {name: $searchName}) {
      ...Board
    }
  }
`;

export default BOARDS_SEARCH;