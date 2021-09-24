import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from 'maki-sdk'
import { Button, CardBody, Text, Flex } from 'maki-toolkit'
import { Link } from 'react-router-dom'
import CardNav from 'components/CardNav'
// import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { TYPE } from 'components/Shared'
import { GreyCard } from 'components/Card'

import ExchangePage from 'components/Layout/ExchangePage'
import { AutoColumn } from 'components/Column'

import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/Swap/styleds'
import PageHeader from 'components/ExchangePageHeader'
import AppBody from 'components/AppBody'

const { body: Body } = TYPE

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <ExchangePage>
      <CardNav activeIndex={1} />
      <AppBody>
        <PageHeader title="Liquidity" description="Add liquidity to receive LP tokens" />
        <AutoColumn gap="lg" justify="center">
          <CardBody>
            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <Flex justifyContent="center">
                <Button id="join-pool-button" as={Link} to="/add/HT" width="100%">
                  Add Liquidity
                </Button>
              </Flex>

              {!account ? (
                <GreyCard padding="40px">
                  <Body color={theme.colors.textDisabled} textAlign="center">
                    Connect to a wallet to view your liquidity.
                  </Body>
                </GreyCard>
              ) : v2IsLoading ? (
                <GreyCard padding="40px">
                  <Body color={theme.colors.textDisabled} textAlign="center">
                    <Dots>Loading</Dots>
                  </Body>
                </GreyCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <GreyCard padding="0px 0px">
                      <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                    </GreyCard>
                  ))}
                </>
              ) : (
                <GreyCard padding="40px">
                  <Body color={theme.colors.textDisabled} textAlign="center">
                    No liquidity found.
                  </Body>
                </GreyCard>
              )}

              <div>
                <Flex justifyContent="center">
                  <Text fontSize="14px" style={{ padding: '0rem 0 0rem 0' }}>
                    Don`t See Your Pool?
                  </Text>
                </Flex>
                <Flex justifyContent="center">
                  <Button variant="secondary" size="md">
                    <Text fontSize="14px" style={{ padding: '0rem 0 0rem 0' }}>
                      <Link id="import-pool-link" to="/find">
                        Import it.
                      </Link>
                    </Text>
                  </Button>
                </Flex>
                <br />
                <Flex justifyContent="center">
                  <Text fontSize="14px" style={{ padding: '.5rem 0 .5rem 0' }}>
                    Staked your LP tokens in a farm?
                    <br />
                    Unstake them to see them here.
                  </Text>
                </Flex>
              </div>
            </AutoColumn>
          </CardBody>
        </AutoColumn>
      </AppBody>
    </ExchangePage>
  )
}
