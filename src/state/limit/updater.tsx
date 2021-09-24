import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LIMIT_INTERFACE from 'config/constants/limit-order'
import { BigNumber, Contract, utils } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useLimitContract } from 'hooks/useContract'
import { useHecoGasEstimative } from 'hooks/useHecoGasEstimative'
import { AppDispatch, AppState } from '../index'
import { 
  limitStart, 
  limitRestart, 
  updateStatus, 
  addOrder, 
  remOrder,
  limitUpdateFee, 
  limitUpdateGas
} from './actions'
import { 
  findOrdersByAddressFromTokens,
   parseEvent, 
  } from '.'

export default function LimitUpdater() {
  const dispatch = useDispatch<AppDispatch>()
  const { account, chainId } = useActiveWeb3React()
  const contract = useLimitContract();
  const tokens = useAllTokens();
  const [canGetOrders, getOrders] = useState(false)
  const { status, orders: initOrders, feeExecutor, feeStake } = useSelector<AppState, AppState['limit']>((s) => s.limit)
  const gas = useHecoGasEstimative(30000)

  const handlerRemOrder = useCallback((...events) => {

    const event = events ? events.pop() : null;
    if (event) {
      const { args } = event
 
      // const order = parseEvent(args, tokens, chainId?.valueOf())
      if (args?.id && BigNumber.isBigNumber(args.id)) {
        // dispatch(remOrder(BigNumber.from(args.id).toNumber()))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, chainId, dispatch])

  useEffect(() => {
    if(account && status !== 'idle'){
      dispatch(limitRestart())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, dispatch])

  useEffect(() => {
    if (contract && (status === 'idle' || status === 'failed')) {
      dispatch(
        limitStart({
          status: 'loading'
        })
      )
      Promise.all([
        contract.STAKE_FEE(),
        contract.EXECUTOR_FEE()
      ])
        .then(result => {
          dispatch(
            limitUpdateFee({
              status: 'succeeded',
              feeStake: result[0].toString(),
              feeExecutor: result[1].toString(),
              error: undefined
            })
          )
          getOrders(true)
        })
        .catch(e => dispatch(
          limitUpdateFee({
            feeExecutor,
            feeStake,
            status: 'failed',
            error: e
          })
        ))
    }
    return () => {
      if (contract) {
        contract.removeAllListeners()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, dispatch])

  useEffect(() => {
    if (contract && status === 'succeeded') {
      if (account && canGetOrders) {
        findOrdersByAddressFromTokens( account, contract, tokens ?? ([] as any)) // o primeiro parametro eh o address da carteira
          .then((orders) => {
            orders.forEach(order => dispatch(addOrder(order)))
            dispatch(
              updateStatus({
                status: 'succeeded'
              })
            )
          })
          .catch(e => {
            console.log('addOrders error', e)
            dispatch(updateStatus({
              status: 'failed',
              error: e
            }))
          })
          .finally(() => getOrders(true))
      }
      contract.on('0x9fdc338d1bfe2f2f0ae25a02b5bdcd2466b63dedaf221055ad4c2f8bf80107cb', (...events) => {
        const event = events ? events.pop() : null;
        if (event) {
          const { args } = event
          const order = parseEvent(args, tokens, chainId?.valueOf())
          if (order && order.id) {
            dispatch(addOrder(order))
          }
        }
      })

      contract.on('0x96887449736ea61232da74d556679628212a6418ae409f6b0f648a416b4e7b86', handlerRemOrder)

      contract.on('0xc54564d8bb24f7208de85ab88c9e3373a39a2813ec2954267e5feee6c83d6344', handlerRemOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, contract, status, canGetOrders])

  useEffect(() => {
    if(gas && gas.prices){
      dispatch(limitUpdateGas(gas))
    }
  }, [gas, dispatch])

  return (<></>)
}