import React, { FunctionComponent, useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from 'components/Row'
import { Button, ChevronDownIcon, Text, useModal } from 'maki-uikit-v2'
import { Input as NumericalInput } from 'components/NumericalInput'
import CoinLogo from 'components/Maki/CoinLogo'
import { useActiveWeb3React } from 'hooks'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'

import TokenSearchModal from './TokenSearchModal'
import { FetchStatus, Token } from '../constant'
import { getBalanceSingle, getEthBalance } from '../utils'

const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`

const Container = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const TokenSelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface Props {
  value: string
  label: string
  chainName: string
  selectedToken: Token
  isOutToken?: boolean
  onSelectToken: (token: Token) => void
  onMax?: (maxAmount: string) => void
  onUserInput: (string) => void
}

const TradeItem: FunctionComponent<Props> = ({
  selectedToken,
  value,
  label,
  chainName,
  isOutToken = false,
  onMax,
  onSelectToken,
  onUserInput,
}) => {
  const { account, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState({
    amount: new BigNumber(0),
    fetchStatus: FetchStatus.NOT_FETCHED,
  })

  useEffect(() => {
    if (account) {
      if (selectedToken) {
        if (selectedToken.address === '') {
          getEthBalance(account, selectedToken.chainId).then((result) => {
            if (result[0] === FetchStatus.SUCCESS) {
              setBalance({
                amount: result[1],
                fetchStatus: FetchStatus.SUCCESS,
              })
            }
          })
          return
        }

        getBalanceSingle(selectedToken, account, selectedToken.chainId).then((result) => {
          if (result[0] === FetchStatus.SUCCESS) {
            setBalance({
              amount: result[1],
              fetchStatus: FetchStatus.SUCCESS,
            })
          }
        })
      }
    }
  }, [account, selectedToken])

  const [onPresentTokenModal] = useModal(
    <TokenSearchModal onSelectToken={onSelectToken} showChainTabs={isOutToken} chainId={chainId} />,
  )

  const balanceToShow = useMemo(() => {
    if (account) {
      if (balance.fetchStatus === FetchStatus.SUCCESS) {
        return getFullDisplayBalance(balance.amount, selectedToken ? selectedToken.decimals : 18).toString()
      }

      return '-'
    }

    return '-'
  }, [balance, account, selectedToken])

  const handleClickMax = useCallback(() => {
    if (onMax) {
      if (balance.fetchStatus === FetchStatus.SUCCESS) {
        onMax(getFullDisplayBalance(balance.amount, selectedToken.decimals).toString())
      }
    }
  }, [onMax, balance, selectedToken])

  return (
    <InputPanel>
      <Container>
        <LabelRow>
          <RowBetween>
            <Text fontSize="14px">
              {label}&nbsp;<strong>{chainName}</strong>
            </Text>

            <Text onClick={handleClickMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
              {balanceToShow}
            </Text>
          </RowBetween>
        </LabelRow>
        <InputRow>
          <NumericalInput
            className="token-amount-input"
            value={value.toString()}
            onUserInput={(val) => onUserInput(val)}
            disabled={balance.fetchStatus !== FetchStatus.SUCCESS}
          />
          {!isOutToken && (
            <Button onClick={handleClickMax} size="sm" variant="text">
              MAX
            </Button>
          )}

          <TokenSelect selected={false} className="open-currency-select-button" onClick={() => onPresentTokenModal()}>
            <Aligner>
              {selectedToken ? (
                <CoinLogo srcs={[selectedToken.logo]} size="24px" style={{ marginRight: '8px' }} />
              ) : null}

              <Text>
                {(selectedToken && selectedToken.symbol && selectedToken.symbol.length > 20
                  ? `${selectedToken.symbol.slice(0, 4)}...${selectedToken.symbol.slice(
                      selectedToken.symbol.length - 5,
                      selectedToken.symbol.length,
                    )}`
                  : selectedToken?.symbol) || 'Select Currency'}
              </Text>
              <ChevronDownIcon />
            </Aligner>
          </TokenSelect>
        </InputRow>
      </Container>
    </InputPanel>
  )
}

export default TradeItem
