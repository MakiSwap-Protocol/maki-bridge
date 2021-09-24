import React from 'react'
import { Text, Flex, useTooltip, TooltipText } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import { useMakiVault } from 'state/hooks'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'

interface FeeSummaryProps {
  stakingTokenSymbol: string
  stakeAmount: string
}

const FeeSummary: React.FC<FeeSummaryProps> = ({ stakingTokenSymbol, stakeAmount }) => {
  const { t } = useTranslation()
  const {
    fees: { withdrawalFee },
  } = useMakiVault()
  const feeAsDecimal = withdrawalFee / 100
  const feeInMaki = (parseFloat(stakeAmount) * (feeAsDecimal / 100)).toFixed(4)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Unstaking fee: %fee%%', { fee: feeAsDecimal })}
      </Text>
      <Text>
        {t(
          'Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time you stake new MAKI in the pool.',
        )}
      </Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <TooltipText ref={targetRef} small>
          {t('Unstaking Fee')}
        </TooltipText>
        <Text fontSize="14px">
          {stakeAmount ? feeInMaki : '-'} {stakingTokenSymbol}
        </Text>
      </Flex>
      <UnstakingFeeCountdownRow />
    </>
  )
}

export default FeeSummary
