import { publish, subscribe, unsubscribe } from "pubsub-js"
import { singletonHook } from "react-singleton-hook"

const usePubSub = singletonHook({
    publish,
    subscribe,
    unsubscribe
}, () => {
    return {
        publish,
        subscribe,
        unsubscribe
    }
})

export default usePubSub