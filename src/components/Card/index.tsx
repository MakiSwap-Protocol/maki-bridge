import React from 'react'
import styled from 'styled-components'
import { Text } from 'maki-toolkit'
import { convertHexToRGB } from 'utils'

const Card = styled.div<any>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.tertiary};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.colors.binance};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

export const DisableCard = styled(Card)`
  background-color: ${({ theme }) => {
    const dec = convertHexToRGB(theme.colors.backgroundDisabled)
    return dec && dec.length === 3 ? `rgba(${dec[0]}, ${dec[1]}, ${dec[2]}, 0.1)` : theme.colors.backgroundDisabled
  }};
  color: ${({ theme }) => theme.colors.textDisabled};
  margin-top: ${({ marginTop }) => marginTop};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: any) => {
  return (
    <BlueCardStyled {...rest}>
      <Text color="#24c7d6">{children}</Text>
    </BlueCardStyled>
  )
}
