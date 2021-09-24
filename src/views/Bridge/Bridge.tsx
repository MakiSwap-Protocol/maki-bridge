import React, { FunctionComponent, useEffect, useCallback, useState } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text } from 'maki-uikit-v2'
import ExchangePage from 'components/Layout/ExchangePage'
import AppBody from 'components/AppBody'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/Swap/styleds'
import PageHeader from 'components/ExchangePageHeader'
import { useActiveWeb3React } from 'hooks'
import { useBridgeActionHandlers, useBridgeState } from 'state/bridge/hooks'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import Loader from 'components/Loader'

import { FetchStatus, mapChainIdToNames, PROVIDERS } from './constant'
import { aggCall, getAllowance, approve, swap } from './utils'
import Header from './components/Header'
import TradeItem from './components/TradeItem'
import BridgeDetails from './components/BridgeDetails'
import ConfirmBridgeModal from './components/ConfirmBridgeModal'

const Bridge: FunctionComponent = () => {
  const { chainId, account } = useActiveWeb3React()
  const { onSelectInToken, onSelectOutToken, onMax, onChangeInTokenAmount, onChangeOutTokenAmount, setTradeLimit } =
    useBridgeActionHandlers()
  const bridgeState = useBridgeState()
  const { inToken, outToken, inAmount, outAmount, bridgeInfo, tradeLimit, infoLoading, swap: swapState } = bridgeState
  const [approvalState, setApprovalState] = useState({
    show: true,
    approving: false,
    approved: false,
  })

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  useEffect(() => {
    const getLimit = async (chain: number) => {
      const { BRIDGE, USDT } = PROVIDERS[chain]

      const params = [
        [BRIDGE, '0x46c1e566'],
        [BRIDGE, '0x5e35e469'],
      ]

      const [err, res] = await aggCall(params, chain)
      if (err !== FetchStatus.SUCCESS) return Promise.resolve([err, res])

      return [FetchStatus.SUCCESS, res.map((item) => new BigNumber(item).dividedBy(10 ** USDT.decimals).toString())]
    }

    Object.keys(mapChainIdToNames).forEach((chain) => {
      getLimit(Number(chain)).then(([err, data]) => {
        if (err === FetchStatus.SUCCESS) {
          const [max, min] = data
          setTradeLimit(Number(chain), { max: +max.toString(), min: +min.toString() })
          return
        }
        setTradeLimit(Number(chain), { max: 0, min: 0 })
      })
    })
  }, [setTradeLimit])

  const handleApprove = useCallback(() => {
    setApprovalState({
      ...approvalState,
      approving: true,
    })

    approve(inToken.address, PROVIDERS[chainId].BRIDGE, account, chainId).then(([err, data]) => {
      if (err === FetchStatus.SUCCESS) {
        setApprovalState({
          show: false,
          approved: true,
          approving: false,
        })
      }
    })
  }, [setApprovalState, approvalState, chainId, account, inToken])

  const handleSwap = useCallback(() => {
    setConfirmModalOpen(true)
  }, [setConfirmModalOpen])

  const handleRenderButtons = useCallback((): JSX.Element => {
    if (account) {
      if (inToken && approvalState.show) {
        return (
          <Button
            onClick={handleApprove}
            disabled={approvalState.approved || approvalState.approving}
            variant="primary"
            width="100%"
          >
            {approvalState.approving ? (
              <AutoRow gap="6px" justify="center">
                Approving <Loader stroke="white" />
              </AutoRow>
            ) : (
              `Approve ${inToken.symbol}`
            )}
          </Button>
        )
      }

      if (bridgeInfo) {
        if (inToken.balance.amount.lt(getDecimalAmount(new BigNumber(bridgeInfo.inToken.amount), inToken.decimals))) {
          return <GreyCard style={{ textAlign: 'center' }}>Insufficient liquidity for this trade.</GreyCard>
        }

        if (Number(bridgeInfo.inToken.impact) > 20 || Number(bridgeInfo.outToken.impact) > 20) {
          return <GreyCard style={{ textAlign: 'center' }}>Price Impact High.</GreyCard>
        }

        if (inToken.chainId !== outToken.chainId) {
          const { max, min } = tradeLimit[inToken.chainId]
          const srcAmount = Number(bridgeInfo.inToken.amountOut) + Number(bridgeInfo.inToken.feeAmount)
          if (srcAmount - max > 0) {
            return <GreyCard style={{ textAlign: 'center' }}>Maximum Transaction Amount is {max} USDT.</GreyCard>
          }

          if (srcAmount - min < 0) {
            return <GreyCard style={{ textAlign: 'center' }}>Minimum Transaction Amount is {min} USDT.</GreyCard>
          }

          if (Number(bridgeInfo.inToken.amount) - 0 < 0 || Number(bridgeInfo.outToken.amountOut) - 0 < 0) {
            return <GreyCard style={{ textAlign: 'center' }}>Transaction amount is less than relayer gas fee.</GreyCard>
          }
        }

        return (
          <Button onClick={handleSwap} variant="primary" width="100%" disabled={swapState.isSwapping || infoLoading}>
            Swap
          </Button>
        )
      }
    }

    if (!account) {
      return <ConnectWalletButton width="100%" />
    }

    return null
  }, [
    account,
    bridgeInfo,
    inToken,
    tradeLimit,
    outToken,
    approvalState,
    swapState,
    infoLoading,
    handleApprove,
    handleSwap,
  ])

  useEffect(() => {
    if (account && inToken) {
      // Wrong network
      if (Object.keys(mapChainIdToNames).includes(String(chainId)) === false) {
        return
      }
      if (inToken.address === '') {
        setApprovalState({
          show: false,
          approving: false,
          approved: true,
        })
        return
      }

      getAllowance(inToken.address, PROVIDERS[chainId].BRIDGE, account, chainId).then(([err, data]) => {
        if (err === FetchStatus.SUCCESS) {
          setApprovalState({
            show: parseInt(data) < Number(inAmount),
            approving: false,
            approved: false,
          })
        }
      })
    }
  }, [inToken, inAmount, account, chainId])

  return (
    <ExchangePage>
      <AppBody>
        <Wrapper>
          <Header title="Bridge" description="" />
          <CardBody>
            <TradeItem
              value={inAmount}
              label="From"
              chainName={mapChainIdToNames[chainId]}
              selectedToken={inToken}
              onSelectToken={onSelectInToken}
              onMax={onMax}
              onUserInput={onChangeInTokenAmount}
            />
            <AutoColumn justify="space-between">
              <AutoRow justify="center" style={{ padding: '1rem 1rem' }}>
                <ArrowWrapper clickable>
                  <IconButton variant="tertiary" style={{ borderRadius: '50%' }} size="sm">
                    <ArrowDownIcon color="primary" width="24px" />
                  </IconButton>
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <TradeItem
              value={outAmount}
              label="To"
              chainName={outToken ? mapChainIdToNames[outToken.chainId] : mapChainIdToNames[chainId]}
              onSelectToken={onSelectOutToken}
              selectedToken={outToken}
              isOutToken
              onUserInput={onChangeOutTokenAmount}
            />
            <BottomGrouping>{handleRenderButtons()}</BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
      <BridgeDetails bridgeInfo={bridgeInfo} />
      <ConfirmBridgeModal isOpen={confirmModalOpen} onDismiss={() => setConfirmModalOpen(false)} />
    </ExchangePage>
  )
}

export default Bridge
