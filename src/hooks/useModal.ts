import { ModalContext } from "src/contexts/ModalContext"
import { useContext } from "react"

export const useModal = () => {
  return useContext(ModalContext)
}