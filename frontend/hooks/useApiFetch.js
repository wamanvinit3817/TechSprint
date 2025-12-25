import { apiFetch } from "../utils/api";
import { useLoading } from "../context/LoadingContext";

export function useApiFetch() {
  const { setLoading } = useLoading();

  const apiFetchWithLoader = async (url, options = {}) => {
    try {
      setLoading(true);
      return await apiFetch(url, options);
    } finally {
      setLoading(false);
    }
  };

  return apiFetchWithLoader;
}
