import { useLocation } from "react-router";

export default function useBlockNumber() {
  const location = useLocation();
  return new URLSearchParams(location.search).get('block') || undefined;
}