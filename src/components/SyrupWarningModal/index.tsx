import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Text } from 'maki-toolkit'
import { AlertTriangle } from 'react-feather'
import { TYPE } from 'components/Shared'
import Modal from 'components/Modal'
import { AutoRow, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'

const { main: Main, body: Body } = TYPE

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: 1px solid #f3841e;
  border-radius: 20px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.colors.failure};
`

export default function SyrupWarningModal({
  isOpen,
  transactionType,
  onConfirm,
}: {
  isOpen: boolean
  transactionType: string
  onConfirm: () => void
}) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked((uc) => !uc), [])

  const handleDismiss = useCallback(() => null, [])
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <Main color="failure">Syrup Warning</Main>
          </AutoRow>
          {transactionType !== '' && (
            <>
              <Body color="failure">
                Please be careful when <strong>{transactionType}</strong> SYRUP.
              </Body>
              <Body color="failure">
                {transactionType === 'Buying'
                  ? 'You will not receive CAKE rewards for holding purchased SYRUP.'
                  : 'You will need to buy back the same amount of SYRUP to be able to convert back to CAKE.'}
              </Body>
            </>
          )}
          <RowBetween>
            <div>
              <label htmlFor="understand-checkbox" style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  id="understand-checkbox"
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />{' '}
                <Text as="span">I understand</Text>
              </label>
            </div>
            <Button
              disabled={!understandChecked}
              variant="danger"
              style={{ width: '140px' }}
              onClick={() => {
                setUnderstandChecked(false)
                onConfirm()
              }}
            >
              Continue
            </Button>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
