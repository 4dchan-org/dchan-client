import { gql } from "apollo-boost";

const USER_GET = gql`
  query User($userId: String!) {
    user(id: $userId) {
      id
      isJanny
    }
  }
`;

export default USER_GET