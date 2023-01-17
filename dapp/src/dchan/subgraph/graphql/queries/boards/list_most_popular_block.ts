import { gql } from "apollo-boost";

export const BOARDS_LIST_MOST_POPULAR_BLOCK = gql`
  fragment MostPopularByBlockBoard on Board {
    id
    title
    postCount
    name
    isLocked
    isNsfw
  }

  query Boards($block: Int!) {
    boards(orderBy: postCount, orderDirection: desc, first: 10, block: {number: $block}) {
      ...MostPopularByBlockBoard
    }
  }
`;

export default BOARDS_LIST_MOST_POPULAR_BLOCK;
