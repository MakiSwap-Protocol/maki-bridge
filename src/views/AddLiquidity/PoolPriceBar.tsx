import React from 'react'
import { Currency, Percent, Price } from 'maki-sdk'
import { Text } from 'maki-toolkit'
import { ONE_BIPS } from 'config/constants'
import { Field } from 'state/mint/actions'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import { TYPE } from 'components/Shared'

const { black: Black } = TYPE

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Black>{price?.toSignificant(6) ?? '-'}</Black>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Black>{price?.invert()?.toSignificant(6) ?? '-'}</Black>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Black>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Black>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
