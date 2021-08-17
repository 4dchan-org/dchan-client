import { publish, subscribe } from "pubsub-js"
import { singletonHook } from "react-singleton-hook"

const usePubSub = singletonHook({
    publish,
    subscribe
}, () => {
    return {
        publish,
        subscribe
    }
})

export default usePubSub