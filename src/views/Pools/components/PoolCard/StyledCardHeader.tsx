import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from 'maki-toolkit'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({ earningTokenSymbol, stakingTokenSymbol, isFinished = false, isAutoVault = false, isStaking = false }) => {
  const poolImageSrc = isAutoVault
    ? `maki-makivault.png`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.png`.toLocaleLowerCase()
  const isMakiPool = earningTokenSymbol === 'MAKI' && stakingTokenSymbol === 'MAKI'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return 'Auto'
    }
    if (isMakiPool) {
      // manual maki
      return 'Manual'
    }
    // all other pools
    return 'Earn'
  }

  const getSubHeading = () => {
    if (isAutoVault) {
      return 'Automatic restaking'
    }
    if (isMakiPool) {
      return 'Stake MAKI, earn MAKI'
    }
    return `Stake ${stakingTokenSymbol}`
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earningTokenSymbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
        </Flex>
        <Image src={`/images/pools/${poolImageSrc}`} alt={earningTokenSymbol} width={64} height={64} />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
