import { createAction } from '@reduxjs/toolkit'
import { BigNumber, providers } from 'ethers'
import { HecoGas } from 'hooks/useHecoGasEstimative'
import { IToken } from './types/token.interface'
import { IOrder } from './types/order.interface'


export interface LimitUpdateStatusAction{
  readonly status: 'loading' | 'succeeded' | 'failed';
  readonly error?: string | Error;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LimitStartAction extends LimitUpdateStatusAction{

}

export interface CreateOrderAction{
  contractAddress: string;
  token0: IToken;
  token1: IToken;
  amount0: number;
  amount1: number;
  gasPrice: number;
  feeStake: number;
  feeExecutor: string;
}

interface CancelOrderAction{
  id: number;
  gasPrice: number;
  contractAddress: string;
}

interface UpdateFeeAction extends LimitUpdateStatusAction{
  feeStake: string;
  feeExecutor: string;
}

const limitStart =  createAction<LimitStartAction>('limit/start')
const limitRestart = createAction('limit/restart')
const updateStatus = createAction<LimitUpdateStatusAction>('limit/updateStatus')
const setProvider = createAction<providers.BaseProvider>('limit/setProvider')
const createOrder = createAction<CreateOrderAction>('limit/createOrder')
const addOrder = createAction<IOrder>('limit/addOrder')
const remOrder = createAction<number>('limit/remOrder')
const getLastOrder = createAction('limit/lastOrder')
const cancelOrder = createAction<CancelOrderAction>('limit/cancelOrder')
const limitUpdateFee = createAction<UpdateFeeAction>('limit/updateFee')
const limitUpdateGas = createAction<HecoGas>('limit/updateGas')
const limitSelectOrder = createAction<number>('limit/selectOrder')
     
export { 
  limitStart,
  limitRestart,
  updateStatus, 
  setProvider, 
  createOrder, 
  getLastOrder, 
  cancelOrder, 
  addOrder,
  remOrder,
  limitUpdateFee,
  limitUpdateGas,
  limitSelectOrder
}