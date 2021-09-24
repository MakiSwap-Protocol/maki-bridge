import { useCallback } from 'react'
import { AppState, AppDispatch } from 'state'
import { useSelector, useDispatch } from 'react-redux'
import { Token } from 'views/Bridge/constant'

import { setInTolerance, setOutTolerance, setUserDeadline } from './actions'

export const usePersistState = (): AppState['persist'] => {
  return useSelector<AppState, AppState['persist']>((state) => state.persist)
}

export const useTempToken = (): Token => {
  const { tempToken } = usePersistState()
  return tempToken
}

export const useCustomTokens = (chainId): Token[] => {
  const { customTokens } = usePersistState()

  return customTokens[chainId]
}

export const useInSlippageTolerance = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { inTolerance: userSlippageTolerance } = usePersistState()

  const setUserSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(setInTolerance(slippageTolerance))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export const useOutSlippageTolerance = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { outTolerance: userSlippageTolerance } = usePersistState()

  const setUserSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(setOutTolerance(slippageTolerance))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export const useUserDeadline = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { userDeadline } = usePersistState()

  const setDeadline = useCallback(
    (deadline: number) => {
      dispatch(setUserDeadline(deadline))
    },
    [dispatch],
  )

  return [userDeadline, setDeadline]
}
