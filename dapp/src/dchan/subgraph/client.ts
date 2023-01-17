import { ApolloClient, InMemoryCache } from "@apollo/client";
import DefaultSettings from "dchan/settings";

let client = new ApolloClient({
    uri: DefaultSettings.subgraph.endpoint,
    cache: new InMemoryCache(),
});

export default client;

export function setApolloClient(newClient: any) {
    client = newClient;
}