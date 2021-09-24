import React from 'react'
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton } from 'maki-uikit-v2'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getMakiVaultEarnings } from 'views/Pools/helpers'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useMakiVault } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import CollectModal from 'views/Pools/components/PoolCard/Modals/CollectModal'
import UnstakingFeeCountdownRow from 'views/Pools/components/MakiVaultCard/UnstakingFeeCountdownRow'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

interface HarvestActionProps extends Pool {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataLoaded,
  isAutoVault,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto MAKI vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  let hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)
  const isCompoundPool = sousId === 0
  const isHtPool = poolCategory === PoolCategory.HECO

  // Auto MAKI vault calculations
  const {
    userData: { makiAtLastUserAction, userShares },
    pricePerFullShare,
    fees: { performanceFee },
  } = useMakiVault()
  const { hasAutoEarnings, autoMakiToDisplay, autoUsdToDisplay } = getMakiVaultEarnings(
    account,
    makiAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  earningTokenBalance = isAutoVault ? autoMakiToDisplay : earningTokenBalance
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  const displayBalance = hasEarnings ? earningTokenBalance : 0
  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isHtPool={isHtPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    'Subtracted automatically from each yield harvest and burned.',
    { placement: 'bottom-start' },
  )

  const actionTitle = isAutoVault ? (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent MAKI profit')}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Balance pt="8px" lineHeight="1" bold fontSize="20px" decimals={5} value={0} />
          <Button disabled>{isCompoundPool ? 'Collect' : 'Harvest'}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={displayBalance} />
          {hasEarnings ? (
            <Balance
              display="inline"
              fontSize="12px"
              color={hasEarnings ? 'textSubtle' : 'textDisabled'}
              decimals={2}
              value={earningTokenDollarBalance}
              unit=" USD"
              prefix="~"
            />
          ) : (
            <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
              0 USD
            </Text>
          )}
        </Flex>
        {isAutoVault ? (
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            <UnstakingFeeCountdownRow isTableVariant />
            <Flex mb="2px" justifyContent="space-between" alignItems="center">
              {tooltipVisible && tooltip}
              <TooltipText ref={targetRef} small>
                {t('Performance Fee')}
              </TooltipText>
              <Flex alignItems="center">
                <Text ml="4px" small>
                  {performanceFee / 100}%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button disabled={!hasEarnings} onClick={onPresentCollect}>
            {isCompoundPool ? 'Collect' : 'Harvest'}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
