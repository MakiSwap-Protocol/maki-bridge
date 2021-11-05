import React, { useCallback, useState, FunctionComponent, useRef } from 'react'
import { Currency } from 'maki-sdk'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBackButton,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  Button,
  Input,
  Box,
} from 'maki-toolkit'
import styled from 'styled-components'
import usePrevious from 'hooks/usePreviousValue'
import { useTranslation } from 'contexts/Localization'
import Row from 'components/Layout/Row'
import Column, { AutoColumn } from 'components/Layout/Column'
import { FixedSizeList } from 'react-window'
import { isAddress } from 'utils'

import { Token } from '../constant'
import TokenList from './TokenList'
import ChainTabs from './ChainTabs'

const Footer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

interface CurrencySearchModalProps extends InjectedModalProps {
  chainId: number
  onSelectToken: (token: Token) => void
}

const TokenSearchModal: FunctionComponent<CurrencySearchModalProps> = ({
  chainId,
  onDismiss = () => null,
  onSelectToken,
}) => {
  const fixedListRef = useRef<FixedSizeList>()
  const [selectedChainId, setSelectedChainId] = useState(chainId)
  const [tokenQuery, setTokenQuery] = useState('')
  const { t } = useTranslation()

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setTokenQuery(checksummedInput || input)
  }, [])

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Select a Token')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <AutoColumn gap="16px">
          <Row>
            <ChainTabs selectedChainId={selectedChainId} onChangeChain={setSelectedChainId} />
          </Row>
          <Row>
            <Input
              id="token-search-input"
              placeholder={t('Search name or paste address')}
              scale="lg"
              autoComplete="off"
              value={tokenQuery}
              onChange={handleInput}
            />
          </Row>
          <Box margin="24px -24px">
            <TokenList
              height={390}
              fixedListRef={fixedListRef}
              tokenQuery={tokenQuery}
              chainId={selectedChainId}
              onSelectToken={onSelectToken}
              handleDismissModal={onDismiss}
            />
          </Box>
        </AutoColumn>
      </StyledModalBody>
    </StyledModalContainer>
  )
}

export default TokenSearchModal
