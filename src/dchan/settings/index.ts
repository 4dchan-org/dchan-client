const DefaultSettings = {
    contract: {
        address: "0x5a139ee9f56c4F24240aF366807490C171922b0E".toLowerCase()
    },
    subgraph: {
        endpoint: "https://api.thegraph.com/subgraphs/name/dchan-network/dchan-alpha-0"
    },
    ipfs: {
        endpoint: "https://api.thegraph.com/ipfs/api/v0"
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
    },
    favorites: {}
}

export default DefaultSettings