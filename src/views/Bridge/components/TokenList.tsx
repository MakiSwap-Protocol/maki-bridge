import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
  FunctionComponent,
  useEffect,
  useState,
} from 'react'
import { Text } from 'maki-uikit-v2'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import Column from 'components/Layout/Column'
import { RowFixed, RowBetween } from 'components/Layout/Row'
import ETH_TOKEN_LIST from 'config/constants/token/1.json'
import BNB_TOKEN_LIST from 'config/constants/token/56.json'
import OKT_TOKEN_LIST from 'config/constants/token/66.json'
import HUOBI_TOKEN_LIST from 'config/constants/token/128.json'
import POLYGON_TOKEN_LIST from 'config/constants/token/137.json'
import { isAddress } from 'utils'
import CoinLogo from 'components/Maki/CoinLogo'
import { useActiveWeb3React } from 'hooks'
import Loader from 'components/Loader'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useHTBalances } from 'state/wallet/hooks'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { setCustomToken, addCustomToken, removeCustomToken } from 'state/persist/actions'
import { useTempToken, useCustomTokens } from 'state/persist/hooks'
import { getBalanceSingle, getEthBalance, getBalance, getErc20 } from '../utils'
import { FetchStatus, Token } from '../constant'

const DEFAULT_TOKEN_LIST = {
  1: ETH_TOKEN_LIST,
  56: BNB_TOKEN_LIST,
  66: OKT_TOKEN_LIST,
  128: HUOBI_TOKEN_LIST,
  137: POLYGON_TOKEN_LIST,
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

interface TokenRowProps {
  onSelect: (token: Token) => void
  isSelected: boolean
  style: CSSProperties
  token: Token
  chainId: number
}

const TokenRow: FunctionComponent<TokenRowProps> = ({ isSelected, style, token, chainId, onSelect }) => {
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { balance } = token

  const handleAddCustomToken = useCallback(
    (event): void => {
      event.stopPropagation()

      dispatch(
        addCustomToken({
          token: {
            ...token,
            isAdded: true,
          },
          chainId,
        }),
      )
    },
    [token, chainId, dispatch],
  )

  const handleRemoveCustomToken = useCallback(
    (event): void => {
      event.stopPropagation()

      dispatch(
        removeCustomToken({
          token: {
            ...token,
            isAdded: true,
          },
          chainId,
        }),
      )
    },
    [token, chainId, dispatch],
  )

  const handleRenderSubtle = useCallback(() => {
    if (token.isCustom) {
      if (token.isAdded) {
        return (
          <Text color="textSubtle" small ellipsis maxWidth="200px" onClick={handleRemoveCustomToken}>
            (Remove)
          </Text>
        )
      }

      return (
        <Text color="textSubtle" small ellipsis maxWidth="200px" onClick={handleAddCustomToken}>
          (Add)
        </Text>
      )
    }

    return (
      <Text color="textSubtle" small ellipsis maxWidth="200px">
        {token.symbol.toLowerCase()}
      </Text>
    )
  }, [token, handleAddCustomToken, handleRemoveCustomToken])

  return (
    <MenuItem style={style} onClick={() => onSelect(token)} disabled={isSelected} selected={false}>
      <CoinLogo srcs={[token.logo]} size="24px" />
      <Column>
        <Text bold>{token.symbol}</Text>
        {handleRenderSubtle()}
      </Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {account ? (
          balance.fetchStatus === FetchStatus.SUCCESS ? (
            <StyledBalanceText>{getFullDisplayBalance(balance.amount, token.decimals)}</StyledBalanceText>
          ) : (
            <Loader />
          )
        ) : null}
      </RowFixed>
    </MenuItem>
  )
}

interface TokenListProps {
  height: number
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  tokenQuery: string
  chainId: number
  onSelectToken: (token: Token) => void
  handleDismissModal: () => void
}

const TokenList: FunctionComponent<TokenListProps> = ({
  height,
  fixedListRef,
  tokenQuery,
  chainId,
  onSelectToken,
  handleDismissModal,
}) => {
  const customTokens = useCustomTokens(chainId)
  const defaultList = useMemo(
    () => [
      ...DEFAULT_TOKEN_LIST[chainId].map((token) => ({
        ...token,
        balance: {
          amount: new BigNumber(0),
          fetchStatus: FetchStatus.NOT_FETCHED,
        },
      })),
      ...customTokens.map((token) => ({
        ...token,
        balance: {
          amount: new BigNumber(0),
          fetchStatus: FetchStatus.NOT_FETCHED,
        },
      })),
    ],
    [chainId, customTokens],
  )
  const dispatch = useDispatch<AppDispatch>()

  const customToken = useTempToken()

  const [tokensWithBalance, setTokensWithBalance] = useState(defaultList)
  const { account } = useActiveWeb3React()

  const addToken = useCallback(async () => {
    if (account) {
      const res = await getErc20(tokenQuery, account, chainId)

      if (res[0] === FetchStatus.SUCCESS) {
        dispatch(
          setCustomToken({
            symbol: res[1].symbol,
            decimals: res[1].decimals,
            balance: res[1].balance,
            address: tokenQuery,
            logo: '',
            isCustom: true,
            isAdded: false,
          }),
        )
      }
    }
  }, [account, chainId, tokenQuery, dispatch])

  const listToShow = useMemo(() => {
    if (isAddress(tokenQuery)) {
      const token = tokensWithBalance.find(
        (item) => item.address && item.address.toLowerCase() === tokenQuery.toLowerCase(),
      )
      if (token) {
        return [token]
      }

      addToken()
      return []
    }

    return tokensWithBalance.filter(
      (item) => item.symbol && item.symbol.toLowerCase().indexOf(tokenQuery.toLowerCase()) !== -1,
    )
  }, [tokenQuery, tokensWithBalance, addToken])

  useEffect(() => {
    if (account) {
      const getBalanceReqs = getBalance(defaultList.slice(1), account, chainId)
      const getEthReq = getEthBalance(account, chainId)
      setTokensWithBalance(defaultList)

      Promise.all([getBalanceReqs, getEthReq]).then(([balanceResult, ethBalanceResult]) => {
        const [balanceErr, balances] = balanceResult
        const [ethErr, eth] = ethBalanceResult

        if (balanceErr === FetchStatus.SUCCESS) {
          setTokensWithBalance([
            {
              ...defaultList[0],
              balance: {
                amount: new BigNumber(eth),
                fetchStatus: FetchStatus.SUCCESS,
              },
            },
            ...balances.sort((a, b) => (b.balance.amount.isGreaterThan(a.balance.amount) ? 1 : -1)),
          ])
        }
      })
    }
  }, [chainId, account, defaultList])

  const handleSelectToken = useCallback(
    (token: Token) => {
      onSelectToken({ ...token, chainId })
      handleDismissModal()
    },
    [chainId, onSelectToken, handleDismissModal],
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const token = data[index]

      return <TokenRow style={style} isSelected={false} onSelect={handleSelectToken} token={token} chainId={chainId} />
    },
    [chainId, handleSelectToken],
  )

  const itemKey = useCallback((index: number, data: any) => data[index].address, [])

  const listData = customToken ? [...listToShow, customToken] : listToShow
  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={listData}
      itemCount={listData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

export default TokenList
