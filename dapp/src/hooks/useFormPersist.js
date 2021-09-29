//https://github.com/tiaanduplessis/react-hook-form-persist/tree/master/src
import { useEffect, useState } from 'react'

const useFormPersist = (
  name,
  { watch, setValue },
  {
    storage = window.localStorage,
    include = [],
    onDataRestored = undefined,
    validate = false,
    dirty = false
  } = {}
) => {
  const [loaded, setLoaded] = useState(false)
  const values = watch(include)

  useEffect(() => {
    const str = storage.getItem(name)
    if (!loaded && str) {
      const values = JSON.parse(str)
      const dataRestored = {}

      Object.keys(values).forEach(key => {
        dataRestored[key] = values[key]
        const v = values[key]
        const opts = { shouldValidate: validate, shouldDirty: true }
        setValue(key, v, opts)
      })

      if (onDataRestored) {
        onDataRestored(dataRestored)
      }

      setLoaded(true)
    }
  }, [dirty, include, storage, onDataRestored, setValue, validate, name, loaded, setLoaded])

  useEffect(() => {
    if(values.filter(v => !!v).length > 0) {
      let item = {}
      values.forEach((v, i) => {
        item[include[i]] = v
      })
      storage.setItem(name, JSON.stringify(item))
    }
  })

  return {
    clear: () => storage.removeItem(name)
  }
}

export default useFormPersist