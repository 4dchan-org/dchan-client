import { gql } from "apollo-boost";

export const BOARDS_LIST_MOST_POPULAR = gql`
  fragment MostPopularBoard on Board {
    id
    title
    postCount
    name
    isLocked
    isNsfw
  }

  query Boards {
    boards(orderBy: postCount, orderDirection: desc, first: 10) {
      ...MostPopularBoard
    }
  }
`;

export default BOARDS_LIST_MOST_POPULAR;
