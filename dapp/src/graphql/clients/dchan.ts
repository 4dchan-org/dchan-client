import { ApolloClient, InMemoryCache } from "@apollo/client";
import DefaultSettings from "settings/default";

let client = new ApolloClient({
    uri: DefaultSettings.subgraph.endpoint,
    cache: new InMemoryCache(),
});

export default client;

export function setApolloClient(newClient: any) {
    client = newClient;
}