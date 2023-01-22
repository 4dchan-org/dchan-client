import { gql } from "@apollo/client";
import CLIENT_FRAGMENT from "dchan/subgraph/graphql/fragments/client";

export const IPFS_CLIENT = gql`
  ${CLIENT_FRAGMENT}

  query IPFSClient {
    dev: clients(first: 1, orderBy: publishedAt, orderDirection: desc, where: {channel: ""}) {
      ...Client
    }
    stable: clients(first: 1, orderBy: publishedAt, orderDirection: desc, where: {channel: "stable"}) {
      ...Client
    }
  }  
`;

export default IPFS_CLIENT