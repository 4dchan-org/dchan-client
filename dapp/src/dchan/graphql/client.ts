import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/opdchan/v1-dchan",
    cache: new InMemoryCache(),
})