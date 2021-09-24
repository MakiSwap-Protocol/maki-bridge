import { createReducer } from '@reduxjs/toolkit'
import { Token } from 'views/Bridge/constant'

import {
  addCustomToken,
  removeCustomToken,
  setCustomToken,
  setInTolerance,
  setOutTolerance,
  setUserDeadline,
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
  inTolerance: number
  outTolerance: number
  userDeadline: number
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
  inTolerance: 50, // 0.5%
  outTolerance: 100, // 1%
  userDeadline: 300, // 5 minutes,
}

export default createReducer<BrideState>(initialState, (builder) =>
  builder
    .addCase(addCustomToken, (state, { payload: { token, chainId } }) => {
      const { customTokens } = state
      if (customTokens[chainId].findIndex((customToken) => customToken.address === token.address) === -1) {
        customTokens[chainId].push(token)
      }
      state.tempToken = null
    })
    .addCase(removeCustomToken, (state, { payload: { token, chainId } }) => {
      const { customTokens } = state

      const index = customTokens[chainId].findIndex(
        (item) => item.address.toLowerCase() === token.address.toLowerCase(),
      )
      if (index !== -1) {
        customTokens[chainId].splice(index, 1)
      }
    })
    .addCase(setCustomToken, (state, { payload }) => {
      return {
        ...state,
        tempToken: payload,
      }
    })
    .addCase(setInTolerance, (state, { payload }) => {
      return {
        ...state,
        inTolerance: payload,
      }
    })
    .addCase(setOutTolerance, (state, { payload }) => {
      return {
        ...state,
        outTolerance: payload,
      }
    })
    .addCase(setUserDeadline, (state, { payload }) => {
      return {
        ...state,
        userDeadline: payload,
      }
    }),
)
