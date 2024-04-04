import { useState } from "react";
import { apiClient } from ".";
import { useCallback } from "react";

const emptyfun = () => {};

export const useApiRequest = (
  uri,
  { onCompleted = emptyfun, onError = emptyfun }
) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetched, setFetched] = useState(false);

  const request = useCallback(
    async ({ method = "POST", ...config } = { method: "POST" }, extraData) => {
      setLoading(true);
      console.log("mehtod", method, config);

      let apiConfig = { url: uri, method, ...config };

      // if(method === "GET" || method ==="HEAD" || method === "DELETE"){
      //     apiConfig.params = data
      //     apiConfig.data = undefined
      // }
      console.log({ apiConfig, apiClient });
      const response = await apiClient.any(apiConfig);
      console.log("response --> ", response);

      setLoading(false);
      setFetched(true);

      if (response.ok) {
        onCompleted(response.data, response, extraData);
        setData(response.data);
      } else {
        onError(response.problem, response.data, response, extraData);
        setError(response.problem);
      }
    },
    [onCompleted, onError, uri]
  );

  const reset = () => {
    setData();
    setError(false);
    setLoading(false);
    setFetched(false);
  };
  const refetch = () => {
    reset();
    request();
  };

  return { request, fetched, loading, data, error, refetch, reset };
};
