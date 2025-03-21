import { useState } from "react";
import { fetchData } from "@/services/apiService";

export const useFetchData = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Create a function to manually trigger the API call
  const call = async (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ) => {
    setLoading(true);
    const result = await fetchData<T>(endpoint, method, body);
    setData(result.data);
    setError(result.error || null);
    setLoading(false);
    return result;
  };

  return { data, error, loading, call };
};
