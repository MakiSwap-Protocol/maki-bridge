import React from 'react'
import styled from 'styled-components'
import { mapChainIdToNames } from '../constant'

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const Tab = styled.div<{ isActive: boolean }>`
  padding: 0.25rem 0.375rem;
  text-align: center;

  color: ${({ isActive }) => (isActive ? '#246EFF' : 'inherit')};
  background: ${({ isActive }) => (isActive ? 'rgba(36, 110, 255, 0.1)' : 'inherit')};
  border-radius: 0.25rem;
  cursor: pointer;
`

interface Props {
  selectedChainId: number
  onChangeChain: (chainId: number) => void
}

const ChainTabs: React.FC<Props> = ({ selectedChainId, onChangeChain }) => {
  return (
    <Tabs>
      {Object.keys(mapChainIdToNames).map((chainId) => {
        return (
          <Tab
            key={chainId}
            onClick={() => onChangeChain(Number(chainId))}
            isActive={selectedChainId === Number(chainId)}
          >
            {mapChainIdToNames[chainId]}
          </Tab>
        )
      })}
    </Tabs>
  )
}

export default ChainTabs
