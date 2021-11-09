import { useCallback } from 'react'
import axios from 'axios'
import { AppState, AppDispatch } from 'state'
import { useSelector, useDispatch } from 'react-redux'
import { Token, ISWAP_API_URL, mapChainIdToNames, PROVIDERS, FetchStatus } from 'views/Bridge/constant'
import { swap, getTradeConfig } from 'views/Bridge/utils'
import { useActiveWeb3React } from 'hooks'

import {
  setInAmount,
  setOutAmount,
  setInToken,
  setOutToken,
  setBridgeInfo,
  updateTradeLimit,
  setBridgeInfoLoading,
  setSwapState,
  setDexConfig,
  setTokenDexConfig,
} from './actions'

export const useBridgeState = (): AppState['bridge'] => {
  return useSelector<AppState, AppState['bridge']>((state) => state.bridge)
}

export const useTempToken = (): Token => {
  const { tempToken } = useBridgeState()
  return tempToken
}

export const useCustomTokens = (chainId): Token[] => {
  const { customTokens } = useBridgeState()

  return customTokens[chainId]
}

export const useInToken = (): Token => {
  const { inToken } = useBridgeState()
  return inToken
}

export const useOutToken = (): Token => {
  const { outToken } = useBridgeState()
  return outToken
}

export const useDexConfig = () => {
  const { dexConfig } = useBridgeState()

  return dexConfig
}

const isSameToken = (tokenA: Token, tokenB: Token): boolean => {
  if (tokenA && tokenB) {
    return tokenA.address === tokenB.address && tokenA.chainId === tokenB.chainId
  }

  return false
}

let requests = []

export const useBridgeActionHandlers = (): {
  onSelectInToken: (token: Token) => void
  onSelectOutToken: (token: Token) => void
  onMax: (maxAmount: string) => void
  onChangeInTokenAmount: (amount: string) => void
  onChangeOutTokenAmount: (amount: string) => void
  handleGetTradeInfo: (params: any, tokenIn: Token, tokenOut: Token) => void
  setTradeLimit: (chainId: number, data: { max: number; min: number }) => void
  onSwap: (chainId: number) => void
  finishSwap: () => void
  handleGetTradeConfig: () => void
  updateTokenDexConfig: (isInToken: boolean, config: any) => void
} => {
  const dispatch = useDispatch<AppDispatch>()
  const bridgeState = useBridgeState()
  const { inToken, outToken, inAmount, outAmount, swap: swapState, dexConfig } = bridgeState
  const { account } = useActiveWeb3React()

  const getDexInfo = useCallback(
    (token: Token) => {
      const base = dexConfig[token.chainId]
      if (!base) {
        return null
      }

      const tokenDex = base.token[token.symbol]
      if (!tokenDex) {
        return base.ddex
      }

      return base.dex[tokenDex]
    },
    [dexConfig],
  )

  const handleGetTradeInfo = useCallback(
    (params: any, tokenIn: Token, tokenOut: Token) => {
      dispatch(setBridgeInfoLoading(true))
      requests.forEach((c) => c('cancel old'))
      requests = []
      const options = {
        cancelToken: new axios.CancelToken((cancel) => {
          requests.push(cancel)
        }),
      }
      axios.post(`${ISWAP_API_URL}/api/get-trade-info-v2`, params, options).then((result) => {
        if (result.data.code === 0) {
          if (tokenIn.chainId === tokenOut.chainId) {
            dispatch(
              setBridgeInfo({
                code: result.data.code,
                inToken: {
                  ...result.data.data,
                },
                outToken: {
                  ...result.data.data,
                },
              }),
            )
            return
          }

          dispatch(
            setBridgeInfo({
              code: result.data.code,
              ...result.data.data,
            }),
          )
        }
      })
    },
    [dispatch],
  )

  const onSelectInToken = useCallback(
    (token) => {
      if (isSameToken(token, outToken)) {
        return
      }

      token.dexInfo = getDexInfo(token)

      dispatch(setInToken(token))
      if (outToken) {
        const isDest = inAmount.length === 0
        const params = {
          inToken: {
            chain: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            amount: inAmount,
            dexInfo: token.dexInfo,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            amountOut: isDest ? outAmount : '',
            dexInfo: outToken.dexInfo,
          },
          direct: isDest ? 'dest' : 'src',
          from: account,
          single: false,
          channel: 'MAKISWAP',
        }

        handleGetTradeInfo(params, token, outToken)
      }
    },
    [dispatch, outToken, inAmount, outAmount, handleGetTradeInfo, account, getDexInfo],
  )

  const onSelectOutToken = useCallback(
    (token) => {
      if (isSameToken(token, inToken)) {
        return
      }

      token.dexInfo = getDexInfo(token)
      dispatch(setOutToken(token))

      if (inToken) {
        const isSrc = outAmount.length === 0
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            dexInfo: inToken.dexInfo,
            amount: isSrc ? inAmount : '',
          },
          outToken: {
            chain: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            dexInfo: token.dexInfo,
            amountOut: outAmount,
          },
          direct: isSrc ? 'src' : 'dest',
          from: account,
          single: false,
          channel: 'MAKISWAP',
        }

        handleGetTradeInfo(params, inToken, token)
      }
    },
    [dispatch, inToken, outAmount, inAmount, handleGetTradeInfo, getDexInfo, account],
  )

  const onChangeInTokenAmount = useCallback(
    (amount: string) => {
      dispatch(setInAmount(amount))

      if (outToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            dexInfo: inToken.dexInfo,
            amount,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            dexInfo: outToken.dexInfo,
            amount: '',
          },
          direct: 'src',
          from: account,
          single: false,
          channel: 'MAKISWAP',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo, account],
  )

  const onChangeOutTokenAmount = useCallback(
    (amount: string) => {
      dispatch(setOutAmount(amount))

      if (inToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            dexInfo: inToken.dexInfo,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            dexInfo: outToken.dexInfo,
            amountOut: amount,
          },
          direct: 'dest',
          from: account,
          single: false,
          channel: 'MAKISWAP',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo, account],
  )

  const onMax = useCallback(
    (maxAmount: string) => {
      dispatch(setInAmount(maxAmount))

      if (outToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            dexInfo: inToken.dexInfo,
            amount: maxAmount,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            dexInfo: outToken.dexInfo,
            amount: '',
          },
          direct: 'src',
          from: account,
          single: false,
          channel: 'MAKISWAP',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo, account],
  )

  const setTradeLimit = useCallback(
    (chainId: number, data) => {
      dispatch(
        updateTradeLimit({
          chainId,
          data,
        }),
      )
    },
    [dispatch],
  )

  const onSwap = useCallback(
    (chainId: number) => {
      dispatch(setSwapState({ isSwapping: true, txhash: null }))
      swap(bridgeState, account, chainId).then(([err, data]) => {
        if (err === FetchStatus.SUCCESS) {
          dispatch(setSwapState({ isSwapping: true, txhash: data }))
          return
        }

        dispatch(setSwapState({ isSwapping: false, txhash: null }))
      })
    },
    [bridgeState, account, dispatch],
  )

  const finishSwap = () => dispatch(setSwapState({ ...swapState, isSwapping: false }))

  const handleGetTradeConfig = useCallback(() => {
    getTradeConfig().then((result) => {
      if (result.data.code === 0) {
        const { list } = result.data
        const payload = {}
        list.forEach((obj) => {
          const key = Object.keys(obj)[0]
          const { dex, token } = obj[key]
          const dexInfo = {}
          const tokenDexMap = {}
          let ddex = null

          dex.forEach((d) => {
            dexInfo[d.dexName] = d
            if (d.isDefault) {
              ddex = d
            }
          })

          Object.keys(token).map((dexName) =>
            token[dexName].map((symbol) => {
              tokenDexMap[symbol] = dexName

              return tokenDexMap[symbol]
            }),
          )

          payload[key] = {
            dex: dexInfo,
            token: tokenDexMap,
            ddex,
          }
        })

        dispatch(setDexConfig(payload))
      }
    })
  }, [dispatch])

  const updateTokenDexConfig = useCallback(
    (isInToken, config) => {
      dispatch(setTokenDexConfig({ isInToken, dexConfig: config }))

      const params = {
        inToken: {
          chain: inToken.chainId,
          address: inToken.address,
          decimals: inToken.decimals,
          symbol: inToken.symbol,
          dexInfo: isInToken ? config : inToken.dexInfo,
          amount: inAmount,
        },
        outToken: {
          chain: outToken.chainId,
          address: outToken.address,
          decimals: outToken.decimals,
          symbol: outToken.symbol,
          dexInfo: isInToken ? outToken.dexInfo : config,
          amountOut: outAmount,
        },
        direct: isInToken ? 'src' : 'dest',
        from: account,
        single: false,
        channel: 'MAKISWAP',
      }

      handleGetTradeInfo(params, inToken, outToken)
    },
    [dispatch, handleGetTradeInfo, account, inToken, outToken, inAmount, outAmount],
  )

  return {
    onSelectInToken,
    onSelectOutToken,
    onMax,
    onChangeInTokenAmount,
    onChangeOutTokenAmount,
    handleGetTradeInfo,
    setTradeLimit,
    onSwap,
    finishSwap,
    handleGetTradeConfig,
    updateTokenDexConfig,
  }
}
