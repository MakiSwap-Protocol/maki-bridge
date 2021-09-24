import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Card } from 'maki-toolkit'

const Load = keyframes`{
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}`

export const BodyWrapper = styled(Card)`
  position: relative;
  max-width: 436px;
  width: 100%;
  z-index: 5;

  // animation: ${Load} 300ms ease-in forwards;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
