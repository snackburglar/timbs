import { useEffect, useState } from "react";

import { apiRequest } from "../api";

export default function useApiResource(path) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest(path, { signal: controller.signal })
      .then((body) =>
        setState({ data: body.data || body, loading: false, error: null }),
      )
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ data: [], loading: false, error });
      });
    return () => controller.abort();
  }, [path, reloadKey]);

  return { ...state, reload: () => setReloadKey((key) => key + 1) };
}
