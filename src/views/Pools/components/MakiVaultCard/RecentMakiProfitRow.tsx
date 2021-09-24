import React from 'react'
import { Flex, Text } from 'maki-toolkit'
import { useWeb3React } from '@web3-react/core'
import { useMakiVault, usePriceMakiHusd } from 'state/hooks'
import { getMakiVaultEarnings } from 'views/Pools/helpers'
import RecentMakiProfitBalance from './RecentMakiProfitBalance'

const RecentMakiProfitCountdownRow = () => {
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { makiAtLastUserAction, userShares, lastUserActionTime },
  } = useMakiVault()
  const makiPriceHusd = usePriceMakiHusd()
  const { hasAutoEarnings, autoMakiToDisplay, autoUsdToDisplay } = getMakiVaultEarnings(
    account,
    makiAtLastUserAction,
    userShares,
    pricePerFullShare,
    makiPriceHusd.toNumber(),
  )
  // eslint-disable-next-line
  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${'Recent MAKI profit'}:`}</Text>
      {hasAutoEarnings && (
        <RecentMakiProfitBalance
          makiToDisplay={autoMakiToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentMakiProfitCountdownRow
