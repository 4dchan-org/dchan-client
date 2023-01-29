import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment User on User{
    id
    b58id
    address
  }
`;

export default USER_FRAGMENT