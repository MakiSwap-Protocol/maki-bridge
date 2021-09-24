import { createReducer } from "@reduxjs/toolkit";
import { BigNumber, providers, Contract } from "ethers";
import { 
  createOrder, 
  limitStart,
  limitRestart, 
  updateStatus, 
  addOrder, 
  remOrder,
  limitUpdateFee, 
  limitUpdateGas,
  limitSelectOrder
} from './actions'
import { IOrder } from "./types/order.interface";
import { IPair } from "./types/pair.interface";
import { EOrderState, EOrderStatus, EOrderType } from "./enums";



export interface LimitState {
  readonly gasPrice: number;
  readonly orders: IOrder[];
  readonly feeStake: string; // hex number 
  readonly feeExecutor: string; // hex number
  readonly status: 'idle' | 'loading' | 'succeeded' | 'failed';
  readonly readContractAddress: string;
  readonly account?: string;
  readonly selectedOrder?: IOrder;
  readonly error?: string | Error;
}

const initialState: LimitState = {
  gasPrice: 0,
  orders: [],
  feeStake: '0x00',
  feeExecutor: '0x00',
  status: 'idle',
  readContractAddress: String(process.env.REACT_APP_LIMIT_CONTRACT),
  selectedOrder: undefined,
  error: undefined,
}

export default createReducer<LimitState>(initialState, (builder) => 
  builder
  .addCase(limitStart, (state, { payload }) => {
    const { status, error } = payload;
    try{
      return {
        ...state,
        status,
        error:  typeof error === 'string' ? new Error(error) : error as Error
      }
    }catch(e){
      return {
        ...state,
        status: 'failed',
        error: typeof e === 'string' ? new Error(e) : e as Error
      }
    }
  })
  .addCase(limitRestart, (state) => {
    return {
      ...initialState,
      feeExecutor: state.feeExecutor,
      feeStake: state.feeStake
    }
  })
  .addCase(updateStatus, (state, { payload }) => {
    const { status, error } = payload;
    try{
      return {
        ...state,
        status,
        error:  typeof error === 'string' ? new Error(error) : error as Error
      }
    }catch(e){
      return {
        ...state,
        status: 'failed',
        error: typeof e === 'string' ? new Error(e) : e as Error
      }
    }
  })
  .addCase(createOrder, (state, { payload }) => {
    const {
      amount0,
      amount1,
      contractAddress,
      feeExecutor,
      feeStake,
      gasPrice,
      token0,
      token1
    } = payload

  })
  .addCase(addOrder, ( state, { payload }) => {
    if(payload.id >= 0 && state.status !== 'idle'){
      const orders = (state.orders ?? [])
      const index = orders.findIndex( order => order.id === payload.id)
      return {
        ...state,
        orders: index >= 0 ? [...orders] : [...orders, payload].sort((a, b) => a.id - b.id)
      }
    }
    return {
      ...state
    }
  })
  .addCase(remOrder, ( state, { payload }) => {
    const index  = (state.orders ?? []).findIndex( order => order.id === payload)
    if(index >= 0){
      state.orders.splice(index,1)
      return {
        ...state,
        status: 'succeeded',
        error: undefined,
        orders: [...state.orders]
      }
    }
    return {
      ...state,
      status: 'succeeded',
      error: undefined,
    }
  })
  .addCase(limitUpdateFee, (state, { payload }) => {
    const { feeStake, feeExecutor, status, error } = payload;
    const _state =  {
      ...state,
      status,
      error,
      feeStake: !!feeStake && !BigNumber.from(feeStake).isNegative() ? feeStake : state.feeStake,
      feeExecutor: !!feeExecutor && !BigNumber.from(feeExecutor).isNegative() ? feeExecutor : state.feeExecutor
    }
    return _state;
  })
  .addCase(limitUpdateGas, (state, { payload }) => {
    return {
      ...state,
      gasPrice: payload.prices.fast
    }
  })
  .addCase(limitSelectOrder, (state, { payload }) => {
    const order = state?.orders.find(_order => _order.id === payload)
    return {
      ...state,
      selectedOrder: order
    }
  })
)


