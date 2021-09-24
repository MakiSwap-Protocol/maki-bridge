import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Text } from 'maki-uikit-v2'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getMakiAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/stats-bg.png');
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const MakiStats = () => {
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getMakiAddress())

  const makiSupply = totalSupply ? getBalanceNumber(totalSupply) - getBalanceNumber(burnedBalance) : 0
  const makiSupplyFormated = makiSupply
  ? `${Number(makiSupply).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  : '-'

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="primary" size="xl" mb="24px">
          Maki Stats
        </Heading>
        <CardImage src="/images/stats-img.png" alt="maki logo" width={64} height={64} />
        <Block>
          <Text color="primaryDark" style={{ lineHeight: '24px' }}>
            {makiSupplyFormated}
          </Text>
          <Text style={{ lineHeight: '36px' }}> TOTAL SUPPLY </Text>
        </Block>
        <Block>
          <Text color="primaryDark" style={{ lineHeight: '24px' }}>
            {getBalanceNumber(burnedBalance).toLocaleString()}
          </Text>
          <Text style={{ lineHeight: '36px' }}> MAKI BURNED </Text>
        </Block>
        <Block>
          <Text color="primaryDark" style={{ lineHeight: '24px' }}>
            16
          </Text>
          <Text style={{ lineHeight: '36px' }}> MAKI / BLOCK </Text>
        </Block>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default MakiStats
