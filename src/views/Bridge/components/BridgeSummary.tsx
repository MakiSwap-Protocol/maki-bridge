import React, { FunctionComponent, useMemo } from 'react'
import { Card, CardBody, Text } from 'maki-uikit-v2'
import { RowBetween, RowFixed } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import { useBridgeState } from 'state/bridge/hooks'
import BigNumber from 'bignumber.js'
import { fixed } from '../utils'

const BridgeSummary: FunctionComponent = () => {
  const { bridgeInfo, outToken, inToken, inTolerance } = useBridgeState()

  const details = useMemo(() => {
    if (inToken.chainId === outToken.chainId) {
      return [
        {
          label: 'Price Imapct',
          value: bridgeInfo.inToken.impact,
          after: '%',
          tip: 'The difference between the market price and estimated price due to trade size.',
        },
        {
          label: 'Slippage Tolerance',
          value: inTolerance / 100,
          after: '%',
          tip: 'Current slippage tolerance.',
        },
        {
          label: 'Minimum received',
          value: `${Number(
            fixed(
              new BigNumber(bridgeInfo.outToken.amountOut).times((100 - inTolerance / 100) / 100),
              outToken.decimals,
            ),
          ).toFixed(8)} ${outToken.symbol}`,
          after: '%',
          tip: 'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
        },
        {
          label: 'Trade Fee',
          value: `${bridgeInfo.inToken.dexFee} ${inToken.symbol}`,
          after: '',
          tip: 'The liquidity provider will receive rewards in the designated trading pair and can be redeemed by withdrawing the liquidity.',
        },
      ]
    }

    const fromRoute = bridgeInfo.inToken.router.slice(0, bridgeInfo.inToken.router.length - 1)
    const destRoute = bridgeInfo.outToken.router.slice(1)
    let routerInter = []
    if (fromRoute.length + destRoute.length !== 0) {
      routerInter = [...fromRoute.map((item) => item.symbol), 'USDT', ...destRoute.map((item) => item.symbol)]
    }

    return [
      {
        label: 'Cross-Chain Handling Fee',
        value: bridgeInfo.inToken.feeAmount ? fixed(new BigNumber(bridgeInfo.inToken.feeAmount), 4) : '-',
        after: 'USDT',
        tip: 'Cross-chain handling fee is 0.004% of the transaction amount',
      },
      {
        label: 'Routing',
        value: routerInter.join('->'),
        after: '',
        tip: '',
      },
      {
        label: 'Original Chain Price Impact',
        value: bridgeInfo.inToken.impact,
        after: '%',
        tip: '',
      },
      {
        label: 'Target Chain Price Impact',
        value: bridgeInfo.outToken.impact,
        after: '%',
        tip: '',
      },
      {
        label: 'Relayer Gas Fee',
        value: bridgeInfo.outToken.relayerGas || '-',
        after: 'USDT',
        tip: 'Gas fee for transactions on the second chain. ',
      },
    ]
  }, [bridgeInfo, outToken, inToken, inTolerance])

  return (
    <Card>
      <CardBody>
        {details.map((detail) => (
          <RowBetween key={detail.label}>
            <RowFixed>
              <Text fontSize="14px">{detail.label}</Text>
              {detail.tip.length > 0 && <QuestionHelper text={detail.tip} />}
            </RowFixed>
            <RowFixed>
              <Text fontSize="14px">
                {detail.value}
                {detail.after}
              </Text>
            </RowFixed>
          </RowBetween>
        ))}
      </CardBody>
    </Card>
  )
}

export default BridgeSummary
