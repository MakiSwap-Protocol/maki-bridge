import { currencyEquals, Trade } from 'maki-sdk'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useBridgeActionHandlers, useBridgeState } from 'state/bridge/hooks'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useActiveWeb3React } from 'hooks'
import { FetchStatus } from 'views/Bridge/constant'

import BridgeModalHeader from './BridgeModalHeader'
import BridgeModalFooter from './BridgeModalFooter'
import { getTradeStatus } from '../../utils'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface ConfirmBridgeModalProps {
  isOpen: boolean
  onDismiss: () => void
}

const ConfirmBridgeModal: React.FunctionComponent<ConfirmBridgeModalProps> = ({ isOpen, onDismiss }) => {
  const { bridgeInfo, swap, inToken, outToken } = useBridgeState()
  const [showTx, setShowTx] = useState(false)
  const { onSwap, finishSwap } = useBridgeActionHandlers()
  const { chainId } = useActiveWeb3React()

  const modalHeader = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeModalHeader />
    }

    return null
  }, [bridgeInfo])

  const modalBottom = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeModalFooter onConfirm={() => onSwap(chainId)} disableConfirm={swap.isSwapping} />
    }

    return null
  }, [bridgeInfo, chainId, swap, onSwap])

  const confirmationContent = useCallback(
    () => (
      <ConfirmationModalContent
        title="Confirm Bridge"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    ),
    [onDismiss, modalHeader, modalBottom],
  )

  useEffect(() => {
    if (bridgeInfo) {
      if (swap.txhash) {
        if (inToken.chainId !== outToken.chainId) {
          getTradeStatus(swap.txhash, inToken.chainId, outToken.chainId).then(([err, data]) => {
            console.log('gggg', err)
            if (err === FetchStatus.SUCCESS) {
              setShowTx(true)
              finishSwap()
            }
          })
          return
        }
        setShowTx(true)
        finishSwap()
      }
    }
  }, [swap, inToken, outToken, bridgeInfo, finishSwap])
  const pendingText = `Swapping ${inToken?.symbol}
   for ${outToken?.symbol}`

  const txToShow = useMemo(() => {
    return showTx ? swap.txhash : ''
  }, [showTx, swap.txhash])
  console.log('ffffff', swap, showTx)
  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      hash={txToShow}
      content={confirmationContent}
      pendingText={pendingText}
      attemptingTxn={swap.isSwapping}
    />
  )
}

export default ConfirmBridgeModal
