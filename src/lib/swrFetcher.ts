import { getToken } from "@/utils/token";
 
export const fetcher = async <T>(url: string) => {
  const token = getToken()
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return result as T;
};
