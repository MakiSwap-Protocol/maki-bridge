import { useCallback, useEffect, useState } from "react"
import useInterval from "./useInterval"

export interface HecoGasPrice {
  fast: number;
  median: number;
  low: number;
}

export interface HecoGas {
  readonly code: number;
  readonly prices: HecoGasPrice;
}

export function useHecoGasEstimative(interval: number): HecoGas | null {
  const [gas, setGas] = useState<HecoGas | null>(null)

    const fetchData = useCallback(async () => {
      try {
        const response = await fetch('https://tc.hecochain.com/price/prediction')
        const res: HecoGas = await response.json()

        setGas(res)
      } catch (error) {
        console.error('Gas estimate failed, trying eth_call to extract error', error)
        throw new Error('Gas estimate failed, trying eth_call to extract error')
      }
    }, [setGas])

    useInterval(fetchData, interval)
  return gas
}