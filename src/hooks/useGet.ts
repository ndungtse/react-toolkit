import { useState } from "react";
import useSWR from "swr";
import axios from "../utils/axios.config";
import { getObjValue } from "../utils/funcs";

interface Opts<T = any> {
  onMount?: boolean;
  fetcher?: (url: string) => Promise<T>;
  /**
   * The key to use to access the data in the response use 'some.other.thing' to access response.some.other.thing
   * @default 'data'
   */
  dataKey?: string;
  defaultData?: T
  useAuth?: boolean;
}

export default function useGet<T>(url: string, opts: Opts<T> = {}) {
  const { fetcher, dataKey, defaultData, onMount = true } = opts;
  const [data, setData] = useState<T | null | undefined>(defaultData);
  const { isLoading, mutate, error } = useSWR(
    url,
    async (url) => {
      let data: T | null | undefined = null;
      if (fetcher) {
        data = await fetcher(url);
      } else {
        const response = await axios.get(url);
        data = dataKey
          ? getObjValue<T>(dataKey, response.data)
          : response.data?.data || response.data;
      }
      setData(data);
      return data;
    },
    { revalidateOnFocus: opts.onMount, revalidateOnMount: opts.onMount }
  );

  return { data, isLoading, error, refetch: mutate };
}
