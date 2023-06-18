import useLocalStorageState from 'use-local-storage-state'

const useEula = () => {
    return useLocalStorageState('4dchan.org.eula.accepted', {
        defaultValue: false
    })
}

export default useEula