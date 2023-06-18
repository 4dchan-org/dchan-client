//https://github.com/tiaanduplessis/react-hook-form-persist/tree/master/src
import { useEffect, useState } from 'react'

export const useFormPersist = (
  name: string,
  { watch, setValue }: any,
  {
    storage = window.localStorage,
    include = [],
    onDataRestored = undefined,
    validate = false,
    dirty = false
  }: any = {}
) => {
  const [loaded, setLoaded] = useState(false)
  const values = watch(include)

  useEffect(() => {
    const str = storage.getItem(name)
    if (!loaded && str) {
      const values = JSON.parse(str)
      const dataRestored: any = {}

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
    if(values.filter((v: any) => v).length > 0) {
      const item: any = {}
      values.forEach((v: any, i: number) => {
        item[include[i]] = v
      })
      storage.setItem(name, JSON.stringify(item))
    }
  })

  return {
    clear: () => storage.removeItem(name)
  }
}