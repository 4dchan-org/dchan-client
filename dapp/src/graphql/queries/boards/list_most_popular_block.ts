import { gql } from "apollo-boost";

const BOARDS_LIST_MOST_POPULAR_BLOCK = gql`
  fragment Board on Board {
    id
    title
    postCount
    name
    isLocked
    isNsfw
  }

  query Boards($block: Int!) {
    boards(orderBy: postCount, orderDirection: desc, first: 10, block: {number: $block}) {
      ...Board
    }
  }
`;

export default BOARDS_LIST_MOST_POPULAR_BLOCK;
