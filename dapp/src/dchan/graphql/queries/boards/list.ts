import { gql } from "apollo-boost";

const BOARDS_LIST = gql`
  query Boards {
    boards(orderBy: postCount, orderDirection: desc) {
      id
      title
      postCount
      name
      isLocked
    }
  }
`;

export default BOARDS_LIST;
