import { ApolloClient, InMemoryCache } from "@apollo/client";
import DefaultSettings from "dchan/settings";

export const SubgraphApolloClient = new ApolloClient({
    uri: DefaultSettings.subgraph.endpoint,
    cache: new InMemoryCache(),
});

export default SubgraphApolloClient;