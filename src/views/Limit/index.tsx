import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, Currency, JSBI, Token, Trade } from 'maki-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text } from 'maki-toolkit'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConfirmSwapModal from 'components/Swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import ExchangePage from 'components/Layout/ExchangePage'
import AdvancedSwapDetailsDropdown from 'components/Swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/Swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/Swap/styleds'
import TradePrice from 'components/Swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import SyrupWarningModal from 'components/SyrupWarningModal'
import ProgressSteps from 'components/ProgressSteps'
import { useHusdPriceFromPid } from 'state/hooks'

import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useActiveWeb3React } from 'hooks'
import { useCurrency, useTokenBySymbolOrName } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  tryParseAmount,
} from 'state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { LinkStyledButton } from 'components/Shared'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import Loader from 'components/Loader'
import PageHeader from 'components/ExchangePageHeader'
import PriceInput from 'components/PriceInput'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { cancelOrder, createOrder } from 'state/limit/'
import { BigNumber } from 'ethers'

import { IToken } from 'state/limit/types/token.interface'
import { AppState } from 'state'
import { remOrder, updateStatus } from 'state/limit/actions'
import { useAddPopup } from 'state/application/hooks'
import { PopupContent } from 'state/application/actions'
import AppBody from 'components/AppBody'
import defaultTokenJson from 'config/constants/token/makiswap.json'
import TableOrders from './tables'
import CancelOrderModal from './dialogs'

const InputWrapper = styled.div`
  position: relative;
  & > p {
    position: absolute;
    top: 36px;
    left: 1rem;
    z-index: 2;
  }
  & input {
    font-weight: bold;
  }
`

const Limit = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const dispatch = useDispatch()
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const makiPriceUsd = useHusdPriceFromPid(3)
  const makiData = defaultTokenJson.tokens.filter((val) => val.symbol === 'MAKI')[0]
  const makiToken = new Token(makiData.chainId, makiData.address, makiData.decimals, makiData.symbol, makiData.name)

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [isSyrup, setIsSyrup] = useState<boolean>(false)
  const [syrupTransactionType, setSyrupTransactionType] = useState<string>('')
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const handleConfirmSyrupWarning = useCallback(() => {
    setIsSyrup(false)
    setSyrupTransactionType('')
  }, [])

  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    otherAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const [token0, token1] = [
    useTokenBySymbolOrName(currencies[Field.INPUT]?.symbol)?.[0],
    useTokenBySymbolOrName(currencies[Field.OUTPUT]?.symbol)?.[0],
  ]

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade
  //   const { address: recipientAddress } = useENSAddress(recipient)
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        // [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : otherAmount,

        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { status, feeStake, feeExecutor, gasPrice, selectedOrder, readContractAddress } = useSelector<
    AppState,
    AppState['limit']
  >((s) => s.limit)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const [price1, setPrice1] = useState('')
  const [amount1, setAmount1] = useState(0)
  const [prevInputCurrency, setPrevInputCurrency] = useState<Currency | undefined>()
  const [prevOutputCurrency, setPrevOutputCurrency] = useState<Currency | undefined>()

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, false)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient,
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }))
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }))
      })
  }, [priceImpactWithoutFee, swapCallback, setSwapState])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }))

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  // This will check to see if the user has selected Syrup to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForSyrup = useCallback(
    (selected: string, purchaseType: string) => {
      if (selected === 'syrup') {
        setIsSyrup(true)
        setSyrupTransactionType(purchaseType)
      }
    },
    [setIsSyrup, setSyrupTransactionType],
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(inputCurrency.symbol.toLowerCase(), 'Selling')
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForSyrup],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      if (outputCurrency.symbol.toLowerCase() === 'syrup') {
        checkForSyrup(outputCurrency.symbol.toLowerCase(), 'Buying')
      }
    },
    [onCurrencySelection, checkForSyrup],
  )
  useEffect(() => {
    const _inputAmount = Number(formattedAmounts[Field.INPUT] ?? 0)
    const _outputAmount = Number(formattedAmounts[Field.OUTPUT] ?? 0)
    if (
      _inputAmount > 0 &&
      _outputAmount > 0 &&
      (!prevInputCurrency ||
        !prevOutputCurrency ||
        prevInputCurrency.symbol !== currencies[Field.INPUT].symbol ||
        prevOutputCurrency.symbol !== currencies[Field.OUTPUT].symbol)
    ) {
      setPrice1((_outputAmount / _inputAmount).toString())
      setAmount1(_outputAmount)
      setPrevInputCurrency(currencies[Field.INPUT])
      setPrevOutputCurrency(currencies[Field.OUTPUT])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedAmounts[Field.INPUT], formattedAmounts[Field.OUTPUT]])

  useEffect(() => {
    const _inputAmount = Number(formattedAmounts[Field.INPUT] ?? 0)
    setAmount1(Number(price1) * _inputAmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price1])

  const parsedAmountInput = tryParseAmount('1', currencies[Field.INPUT])
  const tradeInput = useTradeExactIn(parsedAmountInput, makiToken)
  const parsedAmountOutPut = tryParseAmount('1', currencies[Field.OUTPUT])
  const tradeOutput = useTradeExactIn(parsedAmountOutPut, makiToken)

  const inputUSD =
    Number(makiPriceUsd) *
    (tradeInput ? Number(tradeInput.executionPrice.toSignificant()) : 0) *
    Number(formattedAmounts[Field.INPUT] ?? 0)
  const outputUSD =
    Number(makiPriceUsd) * (tradeOutput ? Number(tradeOutput.executionPrice.toSignificant()) : 0) * Number(amount1)

  // const handleTypeOutput2 = useCallback(
  //   (value: string) => {
  //     const _outputAmount = Number.isNaN(Number(value)) ? 0 : Number(value)
  //     const _price = Number(formattedAmounts[Field.OUTPUT] ?? 0)
  //     setTimeout(() => {
  //       console.log('price',_price)
  //       onUserInput(Field.INPUT, (_price > 0 ? _outputAmount/_price : 0).toPrecision(5))
  //     }, 300)
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [onUserInput, setAmount1, formattedAmounts]
  // )

  return (
    <ExchangePage>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={isSyrup}
        transactionType={syrupTransactionType}
        onConfirm={handleConfirmSyrupWarning}
      />
      <CancelOrderModal
        isOpen={openCancelModal}
        onConfirm={() => {
          if (selectedOrder && account && status !== 'idle') {
            dispatch(
              updateStatus({
                status: 'loading',
              }),
            )
            cancelOrder(selectedOrder.id, account, gasPrice, readContractAddress, library!)
              .then(() => {
                console.log('cancel order success!')
                dispatch(remOrder(selectedOrder.id))
              })
              .catch((e) => {
                console.error('cancel order error: ', e)
              })
              .finally(() => {
                dispatch(
                  updateStatus({
                    status: 'succeeded',
                  }),
                )
              })
          }
          setOpenCancelModal(false)
        }}
        onDismiss={() => setOpenCancelModal(false)}
      />
      <CardNav activeIndex={2} />
      <AppBody>
        <Wrapper id="limit-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <PageHeader
            title="Limit Order"
            description="Trade tokens in an instant"
            // displayIcons={false}
          />
          <CardBody>
            <AutoColumn gap="md">
              <Text fontSize="14px">You Pay</Text>
              <InputWrapper>
                <CurrencyInputPanel
                  label="Amount"
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                />
                <p>~${inputUSD.toLocaleString()}</p>
              </InputWrapper>
              <Text fontSize="14px">{`${currencies[Field.INPUT]?.name?.toUpperCase()} Price`}</Text>
              <PriceInput
                // label={`${currencies[Field.INPUT]?.name} Price`}
                id="price-input"
                value={price1}
                onChange={(value) => {
                  setPrice1(value)
                }}
                currency={currencies[Field.OUTPUT]}
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable>
                    <IconButton
                      variant="tertiary"
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }}
                      style={{ borderRadius: '50%' }}
                      size="sm"
                    >
                      <ArrowDownIcon color="primary" width="24px" />
                    </IconButton>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <InputWrapper>
                <CurrencyInputPanel
                  value={Number(amount1 ?? 0).toString()}
                  onUserInput={handleTypeOutput}
                  label="You Receive"
                  showMaxButton={false}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />
                <p style={{ top: 33 }}>~${outputUSD.toLocaleString()}</p>
              </InputWrapper>
              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.colors.textSubtle} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {showWrap ? null : (
                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontSize="14px">Price</Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Text fontSize="14px">Slippage Tolerance</Text>
                        <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : showWrap ? (
                <Button disabled={Boolean(wrapInputError)} onClick={onWrap} width="100%">
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                </Button>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard textAlign="center">Insufficient liquidity for this trade.</GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    style={{ width: '48%' }}
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      'Approved'
                    ) : (
                      `Approve ${currencies[Field.INPUT]?.symbol}`
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (
                        [currencies[Field.INPUT], currencies[Field.OUTPUT]]
                          .map((currency) => {
                            return currency?.name && currency.symbol && currency.decimals
                          })
                          .reduce((ac, cu) => Boolean(ac && cu), true)
                      ) {
                        const _token0: IToken = {
                          name: token0.name!,
                          decimals: token0?.decimals,
                          id: token0?.address,
                          symbol: token0.symbol!,
                          address: token0?.address,
                          chainId: chainId?.valueOf() ?? -1,
                          derivedETH: 0,
                        }
                        const _token1: IToken = {
                          name: token1.name!,
                          decimals: token1?.decimals,
                          id: token1?.address,
                          symbol: token1.symbol!,
                          address: token1?.address,
                          chainId: chainId?.valueOf() ?? -1,
                          derivedETH: 0,
                        }
                        createOrder(
                          account,
                          _token0,
                          _token1,
                          Number(formattedAmounts[Field.INPUT] ?? '0'),
                          amount1,
                          gasPrice,
                          BigNumber.from(feeStake),
                          BigNumber.from(feeExecutor),
                          readContractAddress,
                          library!,
                        )
                          .then(() => {
                            console.log('create order success!')
                            dispatch(
                              updateStatus({
                                status: 'succeeded',
                                error: undefined,
                              }),
                            )
                          })
                          .catch((e) => {
                            console.error('cancel order error: ', e)
                            dispatch(
                              updateStatus({
                                status: 'failed',
                                error: e,
                              }),
                            )
                          })
                      }
                    }}
                    id="swap-button"
                    disabled={
                      !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                  >
                    Create Order
                  </Button>
                </RowBetween>
              ) : (
                <Button
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  onClick={() => {
                    if (
                      [currencies[Field.INPUT], currencies[Field.OUTPUT]]
                        .map((currency) => {
                          return currency?.name && currency.symbol && currency.decimals
                        })
                        .reduce((ac, cu) => Boolean(ac && cu), true)
                    ) {
                      const _token0: IToken = {
                        name: token0.name!,
                        decimals: token0?.decimals,
                        id: token0?.address,
                        symbol: token0.symbol!,
                        address: token0?.address,
                        chainId: chainId?.valueOf() ?? -1,
                        derivedETH: 0,
                      }
                      const _token1: IToken = {
                        name: token1.name!,
                        decimals: token1?.decimals,
                        id: token1?.address,
                        symbol: token1.symbol!,
                        address: token1?.address,
                        chainId: chainId?.valueOf() ?? -1,
                        derivedETH: 0,
                      }
                      createOrder(
                        account,
                        _token0,
                        _token1,
                        Number(formattedAmounts[Field.INPUT] ?? '0'),
                        amount1,
                        gasPrice,
                        BigNumber.from(feeStake),
                        BigNumber.from(feeExecutor),
                        readContractAddress,
                        library!,
                      )
                        .then(() => {
                          console.log('create order success!')
                          dispatch(
                            updateStatus({
                              status: 'succeeded',
                              error: undefined,
                            }),
                          )
                        })
                        .catch((e) => {
                          console.error('cancel order error: ', e)
                          dispatch(
                            updateStatus({
                              status: 'failed',
                              error: e,
                            }),
                          )
                        })
                    }
                  }}
                  id="swap-button"
                  variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                  width="100%"
                >
                  Create Order
                </Button>
              )}
              {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
      {/* <AdvancedSwapDetailsDropdown trade={trade} /> */}
      <TableOrders modalAction={() => setOpenCancelModal(true)} />
    </ExchangePage>
  )
}

export default Limit
