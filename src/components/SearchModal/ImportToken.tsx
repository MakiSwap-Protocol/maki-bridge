import React, { useState } from 'react'
import { Token, Currency } from 'maki-sdk'
import { Button, Text, ErrorIcon, Flex, Checkbox, Link, Tag } from 'maki-toolkit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getEtherscanLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
    <AutoColumn gap="lg">
      {tokens.map((token) => {
        const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
        const address = token.address
          ? `${token.address.substring(0, 6)}...${token.address.substring(token.address.length - 4)}`
          : null
        return (
          <>
            {list !== undefined ? (
              <Tag
                variant="success"
                outline
                startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
              >
                {t('via')} {list.name}
              </Tag>
            ) : (
              <Tag variant="failure" outline startIcon={<ErrorIcon color="failure" />}>
                {t('Unknown Source')}
              </Tag>
            )}
            <Flex alignItems="center">
              <Text mr="8px">{token.name}</Text>
              <Text>({token.symbol})</Text>
            </Flex>
            {chainId && (
              <Flex justifyContent="space-between" width="100%">
                <Text mr="4px">{address}</Text>
                <Link href={getEtherscanLink(chainId, token.address, 'address')} external>
                  ({t('View on HecoInfo')})
                </Link>
              </Flex>
            )}
          </>
        )
      })}

      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.map((token) => addToken(token))
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </Button>
      </Flex>
    </AutoColumn>
  )
}

export default ImportToken
