import { createAction } from '@reduxjs/toolkit'
import { Token } from 'views/Bridge/constant'

export const addCustomToken = createAction<{
  token: Token
  chainId: number
}>('persist/addCustomToken')

export const removeCustomToken = createAction<{
  token: Token
  chainId: number
}>('persist/removeCustomToken')

export const setCustomToken = createAction<Token>('persist/setCustomToken')

export const setInTolerance = createAction<number>('persist/setInTolerance')
export const setOutTolerance = createAction<number>('persist/setOutTolerance')
export const setUserDeadline = createAction<number>('persist/setUserDeadline')
