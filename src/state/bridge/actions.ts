import { createAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { Token } from 'views/Bridge/constant'
import { BridgeInfo } from './types'

export const setInToken = createAction<Token>('bridge/setInToken')
export const setOutToken = createAction<Token>('bridge/setOutToken')

export const setInAmount = createAction<string>('bridge/setInAmount')
export const setOutAmount = createAction<string>('bridge/setOutAmount')

export const setBridgeInfo = createAction<BridgeInfo>('bridge/setBridgeInfo')
export const setBridgeInfoLoading = createAction<boolean>('bridge/setBridgeInfoLoading')

export const updateTradeLimit =
  createAction<{ chainId: number; data: { max: number; min: number } }>('bridge/updateTradeLimit')

export const setSwapState = createAction<{ isSwapping: boolean; txhash: string }>('bridge/setSwapState')

export const setDexConfig = createAction<any>('bridge/setDexConfig')

export const setTokenDexConfig = createAction<{ isInToken: boolean; dexConfig: any }>('bridge/setTokenDexConfig')
