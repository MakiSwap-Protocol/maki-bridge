import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from 'maki-toolkit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { useMakiVault } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, isAutoVault } = pool
  const { totalMakiInVault } = useMakiVault()
  const isManualMakiPool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (isAutoVault) {
      return getBalanceNumber(totalMakiInVault, stakingToken.decimals)
    }
    if (isManualMakiPool) {
      const manualMakiTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalMakiInVault)
      return getBalanceNumber(manualMakiTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [isAutoVault, totalMakiInVault, isManualMakiPool, totalStaked, stakingToken.decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStakedBalance ? (
          <Flex height="100%" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
