import { gql } from "apollo-boost";

const USER_GET = gql`
  query User($userId: String!) {
    admin(id: $userId) {
      id
    }
    user(id: $userId) {
      id
      jannies {
        board {
          id
        }
      }
    }
  }
`;

export default USER_GET