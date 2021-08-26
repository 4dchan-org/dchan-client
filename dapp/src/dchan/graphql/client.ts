import { ApolloClient, InMemoryCache } from "@apollo/client";
import DefaultSettings from "settings/default";

export default new ApolloClient({
    uri: DefaultSettings.subgraph.endpoint,
    cache: new InMemoryCache(),
})