import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { DEFAULT_GAS_LIMIT } from 'config'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from 'maki-toolkit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useMakiVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'

interface BountyModalProps {
  makiBountyToDisplay: number
  dollarBountyToDisplay: number
  totalPendingMakiHarvest: BigNumber
  callFee: number
  onDismiss?: () => void
  TooltipComponent: React.ElementType
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const BountyModal: React.FC<BountyModalProps> = ({
  makiBountyToDisplay,
  dollarBountyToDisplay,
  totalPendingMakiHarvest,
  callFee,
  onDismiss,
  TooltipComponent,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const makiVaultContract = useMakiVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getBalanceNumber(totalPendingMakiHarvest, 18)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom',
    tooltipPadding: { right: 15 },
  })

  const handleConfirmClick = async () => {
    makiVaultContract
      .harvest({ from: account, gas: DEFAULT_GAS_LIMIT })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Bounty collected!'), t('MAKI bounty has been sent to your wallet.'))
        setPendingTx(false)
        onDismiss()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          t('Could not be collected'),
          t('There may be an issue with your transaction, or another user claimed the bounty first.'),
        )
        setPendingTx(false)
        onDismiss()
      })
  }

  return (
    <Modal title={t('Claim Bounty')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      {tooltipVisible && tooltip}
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{t('You’ll claim')}</Text>
        <Flex flexDirection="column">
          <Balance bold value={makiBountyToDisplay} decimals={7} unit=" MAKI" />
          <Text fontSize="12px" color="textSubtle">
            <Balance
              fontSize="12px"
              color="textSubtle"
              value={dollarBountyToDisplay}
              decimals={2}
              unit=" USD"
              prefix="~"
            />
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          {t('Pool total pending yield')}
        </Text>
        <Balance color="textSubtle" value={totalYieldToDisplay} unit=" MAKI" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {t('Bounty')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {callFeeAsDecimal}%
        </Text>
      </Flex>
      {account ? (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          mb="28px"
        >
          {t('Confirm')}
        </Button>
      ) : (
        <UnlockButton mb="28px" />
      )}
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {t('What’s this?')}
        </Text>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
    </Modal>
  )
}

export default BountyModal
