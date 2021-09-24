import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text } from 'maki-uikit-v2'
import { ArrowDown } from 'react-feather'
import { TYPE } from 'components/Shared'
import Column, { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { useBridgeState } from 'state/bridge/hooks'
import CoinLogo from 'components/Maki/CoinLogo'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from 'hooks'
import { mapChainIdToNames } from 'views/Bridge/constant'

const { main: Main } = TYPE

const PriceInfoText = styled(Text)`
  font-style: italic;
  line-height: 1.3;

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`

const BridgeModalHeader: React.FunctionComponent = () => {
  const { bridgeInfo, inToken, outToken } = useBridgeState()
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="md" style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <Column>
          <RowFixed gap="0px">
            <CoinLogo srcs={[inToken.logo]} size="24px" style={{ marginRight: '12px' }} />
            <Text fontSize="24px" color="primary">
              {Number(bridgeInfo.inToken.amount).toFixed(3)}
            </Text>
          </RowFixed>
        </Column>
        <RowFixed gap="0px">
          <Text fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {inToken.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.colors.textSubtle} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CoinLogo srcs={[outToken.logo]} size="24px" style={{ marginRight: '12px' }} />
          <Text fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }} color="primary">
            {Number(bridgeInfo.outToken.amount).toFixed(3)}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {outToken.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {/* <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
        <PriceInfoText>
          {`Output is estimated. You will receive at least `}
          <span>{getFullDisplayBalance(new BigNumber(bridgeInfo.outToken.amountOut), outToken.decimals)}</span>
          {' or the transaction will revert.'}
        </PriceInfoText>
      </AutoColumn> */}
    </AutoColumn>
  )
}

export default BridgeModalHeader
