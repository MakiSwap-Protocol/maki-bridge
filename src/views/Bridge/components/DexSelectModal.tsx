import React, { useEffect, useState, useMemo, FunctionComponent, useRef } from 'react'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  Heading,
  Box,
  Flex,
  InjectedModalProps,
  Spinner,
} from 'maki-toolkit'
import { AutoColumn } from 'components/Layout/Column'
import styled from 'styled-components'
import { useBridgeActionHandlers, useBridgeState } from 'state/bridge/hooks'
import { useActiveWeb3React } from 'hooks'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'

import { getTradeInfoDex } from '../utils'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

const DexItem = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 22px 20px;
  margin-bottom: 12px;
  position: relative;
  cursor: pointer;

  &:nth-child(1) {
    &:before {
      background-color: ${({ theme }) => theme.colors.success};
      padding: 1px 8px;
      color: white;
      position: absolute;
      top: 0;
      left: 0;
      border-top-left-radius: 8px;
      border-bottom-right-radius: 12px;
      content: 'Recommendations';
      font-size: 12px;
    }
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.success};
    background: ${({ theme }) => theme.colors.card};
  }
`

const DexLogo = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 6px;
`

const DexAmount = styled.div`
  display: flex;
  align-items: center;
  font-weight: 100;

  span {
    font-size: 12px;
    opacity: 0.6;
  }
`

const DexPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.6;
`

interface DexModalProps extends InjectedModalProps {
  isInToken: boolean
}

const DexSelectModal: FunctionComponent<DexModalProps> = ({ isInToken, onDismiss }) => {
  const { inToken, outToken, dexConfig, direct, inTolerance, outTolerance, inAmount, outAmount } = useBridgeState()
  const { account } = useActiveWeb3React()
  const { updateTokenDexConfig } = useBridgeActionHandlers()

  const [loading, setLoading] = useState(false)
  const [dexList, setDexList] = useState([])

  const srcAllDex = useMemo(() => {
    return dexConfig[inToken.chainId].dex
  }, [inToken, dexConfig])

  const dstAllDex = useMemo(() => {
    return dexConfig[outToken.chainId].dex
  }, [outToken, dexConfig])

  useEffect(() => {
    let result = []
    let dexReqs = []
    if (isInToken) {
      const allDex = Object.values(srcAllDex)

      dexReqs = allDex.map((dex: any) => {
        const inParam = {
          chain: inToken.chainId,
          address: inToken.address,
          decimals: inToken.decimals,
          symbol: inToken.symbol,
          dexInfo: dex,
          amount: inAmount,
          amountOut: outAmount,
        }

        const outParam = {
          chain: outToken.chainId,
          address: outToken.address,
          decimals: outToken.decimals,
          symbol: outToken.symbol,
          dexInfo: outToken.dexInfo,
          amount: inAmount,
          amountOut: outAmount,
        }

        return getTradeInfoDex(inParam, outParam, direct, account, true).then(({ data: response }): any => {
          const { data } = response

          if (!data || typeof data !== 'object') return null
          const body = {
            dexSource: dex,
            logo: dex.icon,
            name: dex.dexName,
            impact: data.impact,
            token: 'USDT',
            value: data.amountOut * (1 - inTolerance / 10000),
            ratio: `1 ${inToken.symbol} ≈ ${new BigNumber(1)
              .dividedBy(inAmount)
              .times(data.amountOut)
              .toFixed(6)} USDT`,
            origianlDex: dex,
          }

          return body
        })
      })
    } else {
      const allDex = Object.values(dstAllDex)

      dexReqs = allDex.map((dex: any) => {
        const inParam = {
          chain: inToken.chainId,
          address: inToken.address,
          decimals: inToken.decimals,
          symbol: inToken.symbol,
          dexInfo: inToken.dexInfo,
          amount: inAmount,
          amountOut: outAmount,
        }

        const outParam = {
          chain: outToken.chainId,
          address: outToken.address,
          decimals: outToken.decimals,
          symbol: outToken.symbol,
          dexInfo: dex,
          amount: inAmount,
          amountOut: outAmount,
        }

        return getTradeInfoDex(inParam, outParam, direct, account, true).then(({ data }): any => {
          if (!data || typeof data !== 'object') return null
          const body = {
            dexSource: dex,
            logo: dex.icon,
            name: dex.dexName,
            impact: data.impact,
            token: 'USDT',
            value: data.amountOut * (1 - outTolerance / 10000),
            ratio: `1 ${inToken.symbol} ≈ ${new BigNumber(1)
              .dividedBy(inAmount)
              .times(data.amountOut)
              .toFixed(6)} USDT`,
            origianlDex: dex,
          }

          return body
        })
      })
    }

    Promise.all(dexReqs).then((responses) => {
      result = responses.filter((item) => item !== null).sort((a, b) => b.value - a.value)
      setDexList(result)
    })
  }, [
    account,
    direct,
    dstAllDex,
    inAmount,
    inToken,
    inTolerance,
    isInToken,
    outToken,
    outTolerance,
    srcAllDex,
    outAmount,
  ])

  const handleDexSelect = (dex: any) => {
    updateTokenDexConfig(isInToken, dex.origianlDex)
    onDismiss()
  }

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Select DEX</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <AutoColumn gap="16px">
          <Box margin="24px 0px">
            {dexList.length === 0 && (
              <Flex width="100%" justifyContent="center">
                <Spinner size={30} />
              </Flex>
            )}

            {dexList.map((dex) => {
              return (
                <DexItem key={dex.name} onClick={() => handleDexSelect(dex)}>
                  <Flex alignItems="center" justifyContent="space-between" width="100%">
                    <Flex alignItems="center">
                      <DexLogo src={dex.logo} alt={dex.name} />
                      <div>{dex.name}</div>
                    </Flex>
                    <DexAmount>
                      {dex.value.toFixed(6)}
                      <span>(Minimum received)</span>
                    </DexAmount>
                  </Flex>
                  <DexPrice>
                    <div>Price Impact: {dex.impact}</div>
                    <div>{dex.ratio}</div>
                  </DexPrice>
                </DexItem>
              )
            })}
          </Box>
        </AutoColumn>
      </StyledModalBody>
    </StyledModalContainer>
  )
}

export default DexSelectModal
