const DefaultSettings = {
    contract: {
        address: "0x5a139ee9f56c4F24240aF366807490C171922b0E".toLowerCase()
    },
    subgraph: {
        endpoint: "https://api.thegraph.com/subgraphs/name/dchan-network/dchan-alpha"
    },
    ipfs: {
        endpoint: "https://api.thegraph.com/ipfs/api/v0/add"
    },
    content: {
        score_threshold: 1,
        show_below_threshold: false,
    },
    autorefresh: {
        enabled: true,
        seconds: 60
    }
}

export default DefaultSettings