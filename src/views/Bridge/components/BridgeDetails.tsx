import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { BridgeInfo } from 'state/bridge/types'
import BridgeSummary from './BridgeSummary'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.colors.textSubtle};
  z-index: 1;

  // transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  // transition: transform 300ms ease-in-out;
  opacity: ${({ show }) => (show ? '100%' : '0%')};
  transition: opacity 300ms ease-in-out;
`

interface Props {
  bridgeInfo: BridgeInfo
}

const AdvancedBridgeDetailsDropdown: FunctionComponent<Props> = ({ bridgeInfo }) => {
  const isShow = bridgeInfo !== null && bridgeInfo !== undefined
  return <AdvancedDetailsFooter show={isShow}>{isShow && <BridgeSummary />}</AdvancedDetailsFooter>
}

export default AdvancedBridgeDetailsDropdown
