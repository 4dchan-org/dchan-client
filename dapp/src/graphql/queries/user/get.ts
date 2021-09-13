import { gql } from "apollo-boost";

const USER_GET = gql`
  query User($address: String!, $userId: String!) {
    admin(id: $address) {
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