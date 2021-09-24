import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'maki-toolkit'

const Load = keyframes`{
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}`

const StyledNav = styled.div`
  margin-bottom: 40px;
  // animation: ${Load} 300ms ease-in forwards;
`

export interface NavProps {
  activeIndex?: number
}

export const Nav: React.FC<NavProps> = ({ activeIndex = 0, children }) => (
  <StyledNav>
    <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
      {React.Children.toArray(children) as React.ReactElement[]}
    </ButtonMenu>
  </StyledNav>
)

const CardNav: React.FC<NavProps> = ({ activeIndex }) => (
  <Nav activeIndex={activeIndex}>
    <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
      Swap
    </ButtonMenuItem>
    <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
      Liquidity
    </ButtonMenuItem>
    <ButtonMenuItem id="limit-nav-link" to="/limit" as={Link}>
      Limit
    </ButtonMenuItem>
  </Nav>
)
export default CardNav
