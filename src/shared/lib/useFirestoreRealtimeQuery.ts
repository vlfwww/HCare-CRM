import { useEffect } from "react";
import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface FirestoreRealtimeQueryOptions<T> {
  queryKey: QueryKey;
  enabled: boolean;
  fetchInitialData: () => Promise<T>;
  subscribe: (onData: (data: T) => void, onError: (error: Error) => void) => () => void;
}

export function useFirestoreRealtimeQuery<T>({
  queryKey,
  enabled,
  fetchInitialData,
  subscribe,
}: FirestoreRealtimeQueryOptions<T>) {
  const queryClient = useQueryClient();
  const queryKeyHash = JSON.stringify(queryKey);
  const query = useQuery({
    queryKey,
    queryFn: fetchInitialData,
    enabled,
  });

  useEffect(() => {
    if (!enabled) return;

    return subscribe(
      (data) => queryClient.setQueryData(queryKey, data),
      () => undefined,
    );
  }, [enabled, queryClient, queryKeyHash, subscribe]);

  return query;
}
