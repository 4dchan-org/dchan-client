import { gql } from "apollo-boost";
import BOARD_FRAGMENT from 'graphql/fragments/board';

const BOARD_GET = gql`
  ${BOARD_FRAGMENT}
  
  query BoardGet($board: String!, $block: Int!) {
    board(id: $board, block: {number: $block}) {
      ...Board
    }
  }
`;

export default BOARD_GET