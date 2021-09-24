import React from 'react'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from 'maki-toolkit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const EarnAssetCard = () => {
  const activeNonMakiPools = pools.filter((pool) => !pool.isFinished && !pool.earningToken.symbol.includes('MAKI'))
  const latestPools: Pool[] = orderBy(activeNonMakiPools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
  // Always include MAKI
  const assets = ['SOY', ...latestPools.map((pool) => pool.earningToken.symbol)].join(', ')

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="text" size="lg">
          Earn and Compound
        </Heading>
        <CardMidContent color="primaryDark">{assets}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="text" size="lg">
            in Pools
          </Heading>
          <NavLink exact activeClassName="active" to="/pools" id="pool-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
