import { useState } from "react";

interface UseFetchResponse<T> {
  data: T | string | null;
  isLoading: boolean;
  error: string | unknown;
  fetchData: (url: string, options: RequestInit | undefined) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | string | null>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | string[] | undefined>>
  errorMsg: string[] | string | undefined;
}

export const useFetch = <T>(): UseFetchResponse<T> => {
  const [data, setData] = useState<T | string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorMsg, setErrorMsg] = useState<string[] | string>();

  const fetchData = async (url: string, options: RequestInit | undefined) => {
    try {
      setIsLoading(true);
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error);
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText};
        }`
        );
      }
      setData(data);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError(new Error("There is SyntaxError"));
      } else {
        setError(error as Error);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, errorMsg, fetchData, setData, setErrorMsg, setError };
};
