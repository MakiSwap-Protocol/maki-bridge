/* eslint-disable import/order */
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useLocation } from 'react-router-dom'
import styled from 'styled-components';
import { Button } from 'maki-uikit-v2'
import { darken } from 'polished'

import { DisableCard } from 'components/Card'
import TableNav from './tableNav'
import { Table, TableData } from './table'
import "./styles.css"
import { AppState } from 'state';
import { EOrderStatus, EOrderType, EOrderState } from 'state/limit/enums';
import { shortenAddress } from 'utils';
import CancelOrderModal from '../dialogs';
import { limitSelectOrder } from 'state/limit/actions';
import { useWeb3React } from '@web3-react/core';

const activeClassName = 'ACTIVE'

const CancelButton = styled(Button)`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  border: none;
  padding: 8px 12px;
  height: 32px;

  &.${activeClassName} {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`

interface TableLimitOrderProp {
  modalAction?: () => void;
}

export default function ({ modalAction }: TableLimitOrderProp) {
  const { search } = useLocation()
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const params = new URLSearchParams(search)
  // const _table = params.get('table')
  const activeIndex = params.get('table') === 'closed-orders' ? 2 : params.get('table') === 'completed-orders' ? 1 : 0
  const { status, orders, error } = useSelector<AppState, AppState['limit']>((s) => s.limit)
  const getData = useCallback((): TableData[] => {
    return orders ?
      orders
        .filter(order => {
          return order.trader.toLowerCase() === account.toLowerCase() && (activeIndex === 0 ? (order.state === EOrderState.CREATED) :
            activeIndex === 1 ? (order.state === EOrderState.FINISHED) :
            order.state === EOrderState.CANCELLED)
        })
        .map((order) => {
          return {
            id: order.id,
            type: EOrderType[order.type === EOrderType.BUY ? order.type : EOrderType.SELL],
            pair: `${order.tokenOut.symbol} / ${order.tokenIn.symbol}`,
            ramount: order.tokenOutAmount.toFixed(8),
            price: order.price.toFixed(8),
            pamount: order.tokenInAmount.toFixed(8),
            // transaction: shortenAddress(order.trader),
            // eslint-disable-next-line eqeqeq
            actions: order.status.toString() != EOrderStatus.PROCESSING.toString() && order.state != EOrderState.CANCELLED && order.state != EOrderState.FINISHED
              ? 'Cancel Order' : ' - '
          } as TableData
        }) : []
  }, [orders, activeIndex, account])
  return (
    <DisableCard marginTop="24px">
      <TableNav
        activeIndex={activeIndex}
      />
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeIndex > 1 ? "closed-orders" : activeIndex === 1 ? "completed-orders" : "my-orders"}
          in={activeIndex}
          addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
          classNames="fade"
        >
          <Table
            id="table-my-orders"
            columns={[
              {
                Header: 'Type',
                accessor: 'type'
              },
              {
                Header: 'Pair',
                accessor: 'pair'
              },
              {
                Header: 'Receive Amount',
                accessor: 'ramount',
                Cell: ({ value, row }) => {
                  const orderId = row.original.id
                  const bOrder = orders.find(item => item.id === orderId)
                  return (
                    <p>
                      {value}
                      {bOrder && (
                        <span style={{ marginLeft: 5 }}>
                          {bOrder?.tokenOut?.symbol}
                        </span>
                      )}
                    </p>
                  )
                }
              }, {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value, row }) => {
                  const orderId = row.original.id
                  const bOrder = orders.find(item => item.id === orderId)
                  return (
                    <p>
                      {value}
                      {/* {bOrder && (
                        <span style={{ marginLeft: 5 }}>
                          {bOrder?.tokenIn?.symbol}
                        </span>
                      )} */}
                    </p>
                  )
                }
              }, {
                Header: 'Pay Amount',
                accessor: 'pamount',
                Cell: ({ value, row }) => {
                  const orderId = row.original.id
                  const bOrder = orders.find(item => item.id === orderId)
                  return (
                    <p>
                      {value}
                      {bOrder && (
                        <span style={{ marginLeft: 5 }}>
                          {bOrder?.tokenIn?.symbol}
                        </span>
                      )}
                    </p>
                  )
                }
              },
              // {
              //   Header: 'Transaction',
              //   accessor: 'transaction'
              // },
              {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ value, row }) => {
                  const { original } = row
                  return (
                    <>
                    {
                      value === ' - ' ?
                      <div style={{ cursor: 'pointer' }}>{value}</div>
                      :
                      <CancelButton
                        onClick={
                          ($e) => {
                            $e.preventDefault()
                            if (original) {
                              dispatch(limitSelectOrder(original?.id))
                            }
                            modalAction?.()
                          }
                        }>
                        {value}
                      </CancelButton>
                    }
                    </>
                  )
                }
              },
            ]}
            data={getData()}
          />
        </CSSTransition>
      </SwitchTransition>
    </DisableCard>
  )
}