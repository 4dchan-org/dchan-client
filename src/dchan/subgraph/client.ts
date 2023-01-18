import { ApolloClient, InMemoryCache } from "@apollo/client";
import DefaultSettings from "dchan/settings";

const subgraphClient = new ApolloClient({
    uri: DefaultSettings.subgraph.endpoint,
    cache: new InMemoryCache(),
});

export default subgraphClient;