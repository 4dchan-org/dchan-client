import { gql } from "apollo-boost";

const USER_FRAGMENT = gql`
  fragment User on User{
    id
    address
  }
`;

export default USER_FRAGMENT