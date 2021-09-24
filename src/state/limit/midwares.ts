import { Middleware, MiddlewareAPI, Dispatch } from "redux";
import { AnyAction } from "@reduxjs/toolkit";
import { cancelOrder } from '.'
import { LimitState } from "./reducer";
import { CreateOrderAction, createOrder as createOrderAction, remOrder } from './actions'

type DispatchType = Dispatch<AnyAction>;

export const limitOrderMiddleware: Middleware<undefined, any, DispatchType> = (
  api: MiddlewareAPI<DispatchType, LimitState>
) => {
  const state = api.getState()
  return (next: DispatchType) => (action: AnyAction) => {
    // console.log('middleware action', action)
    if (action.type === createOrderAction.type) {
      const {
        token0,
        token1,
        amount0,
        amount1,
        gasPrice,
        contractAddress,
      } = (action.payload as CreateOrderAction)
      const { feeExecutor, feeStake } = state
      // createOrder(
      //   token0, 
      //   token1, 
      //   amount0, 
      //   amount1, 
      //   gasPrice, 
      //   feeStake, 
      //   BigNumber.from(feeExecutor), 
      //   contractAddress, 
      //   providers.getDefaultProvider() as providers.Web3Provider
      // )
    } else if(action.type === remOrder.type){
      const { selectedOrder, account, gasPrice, readContractAddress } = state
      if(selectedOrder && account && readContractAddress){

        // cancelOrder(selectedOrder.id, account, gasPrice, readContractAddress, )
      }
    }
    return next(action)
  }

}