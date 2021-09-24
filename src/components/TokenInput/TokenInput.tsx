import React from 'react'
import { Box, Button, Flex, Text, Input, InputProps } from 'maki-toolkit'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  value: string
  onSelectMax?: () => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  return (
    <Box>
      <Flex justifyContent="flex-end" minHeight="21px" mb="8px">
        <Text color="primary" fontSize="14px">
          {max.toLocaleString()} {symbol} Available
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Input onChange={onChange} placeholder="0" value={value} />
        <Flex alignItems="center">
          <Text bold color="primary" textTransform="uppercase" mx="8px">
            {symbol}
          </Text>
          <div>
            <Button scale="sm" onClick={onSelectMax}>
              Max
            </Button>
          </div>
        </Flex>
      </Flex>
    </Box>
  )
}

export default TokenInput
