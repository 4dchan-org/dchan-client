import { gql } from "@apollo/client";
import BOARD_FRAGMENT from 'src/subgraph/graphql/fragments/board';

export const BOARD_GET = gql`
  ${BOARD_FRAGMENT}
  
  query BoardGet($board: String!, $block: Int!) {
    boardRef(id: $board, block: {number: $block}) {
      board {
        ...Board
      }
    }
    board(id: $board, block: {number: $block}) {
      ...Board
    }
  }
`;

export default BOARD_GET