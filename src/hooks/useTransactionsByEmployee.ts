import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string | null) => {
      if (employeeId === null) {
        console.warn('employeeId was null');
      // Set the state to a default value or do nothing
      return;
      }
      
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )
  
      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )
  

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
