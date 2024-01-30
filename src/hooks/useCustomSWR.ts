import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";

export const useCustomSWR = <T>(apiUrl: string | null) => {
  const result = useSWR(apiUrl, fetcher<T>, {
    revalidateOnFocus: false,
  });

  return result;
};
