import React from 'react'
import { Text, TooltipText, useTooltip } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

interface RecentMakiProfitBalanceProps {
  makiToDisplay: number
  dollarValueToDisplay: number
  dateStringToDisplay: string
}

const RecentMakiProfitBalance: React.FC<RecentMakiProfitBalanceProps> = ({
  makiToDisplay,
  dollarValueToDisplay,
  dateStringToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={makiToDisplay} decimals={3} bold unit=" MAKI" />
      <Balance fontSize="16px" value={dollarValueToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    {
      placement: 'bottom-end',
    },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={makiToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentMakiProfitBalance
