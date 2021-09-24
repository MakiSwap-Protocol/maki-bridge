import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text, useMatchBreakpoints } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { useMakiVault } from 'state/hooks'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import { StyledCard, StyledCardInner } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentMakiProfitRow from './RecentMakiProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface MakiVaultProps {
  pool: Pool
  showStakedOnly: boolean
}

const MakiVaultCard: React.FC<MakiVaultProps> = ({ pool, showStakedOnly }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFee },
  } = useMakiVault()

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isPromoted={{ isDesktop: isXl }}>
      <StyledCardInner>
        <StyledCardHeader
          isStaking={accountHasSharesStaked}
          isAutoVault
          earningTokenSymbol="MAKI"
          stakingTokenSymbol="MAKI"
        />
        <StyledCardBody isLoading={isLoading}>
          <AprRow pool={pool} performanceFee={performanceFeeAsDecimal} />
          <Box mt="24px">
            <RecentMakiProfitRow />
          </Box>
          <Box mt="8px">
            <UnstakingFeeCountdownRow />
          </Box>
          <Flex mt="32px" flexDirection="column">
            {account ? (
              <VaultCardActions pool={pool} accountHasSharesStaked={accountHasSharesStaked} isLoading={isLoading} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </StyledCardBody>
        <CardFooter pool={pool} account={account} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default MakiVaultCard
