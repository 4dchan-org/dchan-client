const DefaultSettings = {
    contract: {
        address: "0x5a139ee9f56c4F24240aF366807490C171922b0E".toLowerCase()
    },
    subgraph: {
        endpoint: "https://gateway.thegraph.com/api/418eac8d0a68edf19ab2e47917049c65/subgraphs/id/Aaot6bDHNzCLKRTnbzrCUHEuFKvSQ84quNhWpwyv3cHr"
    },
    ipfs: {
        endpoint: "https://ipfs.4dchan.org/ipfs/"
    },
    content_view: {
        page_size: 25,
        board_default_view_mode: "catalog",
        board_sort_threads_by: "lastBumpedAt",
        board_sort_direction: "desc"
    },
    content_filter: {
        score_threshold: 1,
        show_below_threshold: false,
    },
    autorefresh: {
        enabled: true,
        seconds: 10
    }
}

export default DefaultSettings