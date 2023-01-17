import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "graphql/fragments/board";

export const BOARDS_SEARCH_BLOCK = gql`
  ${BOARD_FRAGMENT}

  query BoardsSearch($searchName: String!, $searchTitle: String!, $block: Int) {
    searchByTitle: boardSearch(text: $searchTitle, block: {number: $block}) {
      ...Board
    }
    searchByName: boards(where: {name: $searchName}, block: {number: $block}) {
      ...Board
    }
  }
`;

export default BOARDS_SEARCH_BLOCK;
