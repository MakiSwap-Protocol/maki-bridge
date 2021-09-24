import { Currency, HUOBI, Token } from 'maki-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useHttpLocations from 'hooks/useHttpLocations'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useUserTokenLogo } from 'state/user/hooks'
import Logo from 'components/Logo'
import CoinLogo from 'components/Maki/CoinLogo'

const getTokenLogoURL = (address: string) =>
`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/hecochain/assets/${address}/logo.png`

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const userTokenLogo = useUserTokenLogo(currency.symbol)

  const srcs: string[] = useMemo(() => {
    if (currency === HUOBI) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, `/images/coins/${currency?.symbol ?? 'token'}.png`, getTokenLogoURL(currency.address)]
      }

      return [
        ...(userTokenLogo ? [userTokenLogo] : []),
        `/images/coins/${currency?.symbol ?? 'token'}.png`,
        getTokenLogoURL(currency.address)
      ]
    }
    return []
  }, [currency, uriLocations, userTokenLogo])

  if (currency === HUOBI) {
    return <StyledBnbLogo src="/images/coins/ht.svg" size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}