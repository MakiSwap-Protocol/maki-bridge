import { createReducer } from '@reduxjs/toolkit'
import { Token } from 'views/Bridge/constant'
import { BridgeInfo, SwapState, TradeLimit } from './types'

import {
  setBridgeInfo,
  setBridgeInfoLoading,
  setDexConfig,
  setInAmount,
  setInToken,
  setOutAmount,
  setOutToken,
  setSwapState,
  setTokenDexConfig,
  updateTradeLimit,
} from './actions'

interface CustomTokens {
  56: Token[]
  128: Token[]
  137: Token[]
  66: Token[]
  1: Token[]
}

export interface BrideState {
  customTokens: CustomTokens
  tempToken: Token
  inToken: Token
  outToken: Token
  inAmount: string
  outAmount: string
  bridgeInfo: BridgeInfo
  inTolerance: number
  outTolerance: number
  userDeadline: number
  tradeLimit: TradeLimit
  infoLoading: boolean
  swap: SwapState
  dexConfig: any
  direct: string
}

const initialState: BrideState = {
  customTokens: {
    56: [],
    128: [],
    137: [],
    66: [],
    1: [],
  },
  tempToken: null,
  inToken: null,
  outToken: null,
  inAmount: '',
  outAmount: '',
  bridgeInfo: null,
  inTolerance: 50, // 0.5%
  outTolerance: 100, // 1%
  userDeadline: 300, // 5 minutes,
  tradeLimit: {
    128: { max: 0, min: 0 },
    56: { max: 0, min: 0 },
    137: { max: 0, min: 0 },
    66: { max: 0, min: 0 },
    1: { max: 0, min: 0 },
  },
  infoLoading: false,
  swap: {
    isSwapping: false,
    txhash: null,
  },
  dexConfig: null,
  direct: 'inToken',
}

export default createReducer<BrideState>(initialState, (builder) =>
  builder

    .addCase(setInToken, (state, { payload }) => {
      return {
        ...state,
        inToken: payload,
      }
    })
    .addCase(setOutToken, (state, { payload }) => {
      return {
        ...state,
        outToken: payload,
      }
    })
    .addCase(setInAmount, (state, { payload }) => {
      return {
        ...state,
        inAmount: payload,
        direct: 'inToken',
      }
    })
    .addCase(setOutAmount, (state, { payload }) => {
      return {
        ...state,
        outAmount: payload,
        direct: 'outToken',
      }
    })
    .addCase(setBridgeInfo, (state, { payload }) => {
      return {
        ...state,
        inAmount: payload.inToken.amount,
        outAmount: payload.outToken.amountOut,
        bridgeInfo: payload,
        infoLoading: false,
      }
    })

    .addCase(updateTradeLimit, (state, { payload: { chainId, data } }) => {
      const { tradeLimit } = state
      tradeLimit[chainId] = data
    })
    .addCase(setBridgeInfoLoading, (state, { payload }) => {
      return {
        ...state,
        infoLoading: payload,
      }
    })
    .addCase(setSwapState, (state, { payload }) => {
      return {
        ...state,
        swap: {
          ...payload,
        },
      }
    })
    .addCase(setDexConfig, (state, { payload }) => {
      return {
        ...state,
        dexConfig: payload,
      }
    })
    .addCase(setTokenDexConfig, (state, { payload: { isInToken, dexConfig } }) => {
      const { inToken, outToken } = state
      if (isInToken) {
        return {
          ...state,
          inToken: {
            ...inToken,
            dexInfo: dexConfig,
          },
        }
      }

      return {
        ...state,
        outToken: {
          ...outToken,
          dexInfo: dexConfig,
        },
      }
    }),
)
