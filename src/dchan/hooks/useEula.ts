import useLocalStorageState from 'use-local-storage-state'

const useEula = () => {
    return useLocalStorageState('dchan.network.eula.accepted', {
        defaultValue: false
    })
}

export default useEula