import { gql } from "apollo-boost";

const BOARDS_LIST = gql`
  query Boards {
    boards {
      id
      title
      postCount
      name
    }
  }
`;

export default BOARDS_LIST;
