import { gql } from "apollo-boost";

const BOARDS_SEARCH = gql`
  query BoardsSearch($searchName: String, $searchTitle: String) {
    searchByTitle: boardSearch(text: $searchTitle) {
      ...Board
    }
    searchByName: boards(where: {name: $searchName}) {
      ...Board
    }
  }
`;

export default BOARDS_SEARCH;
