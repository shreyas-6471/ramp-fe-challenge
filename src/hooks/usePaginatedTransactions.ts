import { useCallback, useState } from "react";
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";
import { useWrappedRequest } from "./useWrappedRequest";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache } = useCustomFetch();
  const { loading, wrappedRequest } = useWrappedRequest();
  
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const fetchAll = useCallback(
    () => (wrappedRequest(async () => {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
        }
      );
  
      if (response !== null) {
        setPaginatedTransactions((previousResponse) => {
          if (previousResponse === null) {
            return response;
          }
          return { data: [...previousResponse.data, ...response.data], nextPage: response.nextPage };
        });
      }
    }) as Promise<void>), // Type assertion added here
    [fetchWithCache, paginatedTransactions, wrappedRequest]
  );
  
  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
