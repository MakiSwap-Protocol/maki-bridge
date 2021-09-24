import React from 'react'
import { Text } from 'maki-uikit-v2'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { getMakiAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceMakiHusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from './CardValue'
import CardHusdValue from './CardHusdValue'

const MakiWalletBalance = () => {
  const { balance: makiBalance } = useTokenBalance(getMakiAddress())
  const makiPriceHusd = usePriceMakiHusd()
  const husdBalance = new BigNumber(getBalanceNumber(makiBalance)).multipliedBy(makiPriceHusd).toNumber()
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        Locked
      </Text>
    )
  }

  return (
    <>
      <CardValue value={getBalanceNumber(makiBalance)} decimals={4} fontSize="24px" lineHeight="36px" />
      {makiPriceHusd.gt(0) ? <CardHusdValue value={husdBalance} /> : <br />}
    </>
  )
}

export default MakiWalletBalance
