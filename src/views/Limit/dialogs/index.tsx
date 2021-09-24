import React, { useState, MouseEvent, useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from 'maki-toolkit'

import Modal from 'components/Modal'
import { Wrapper, Section, ContentHeader } from 'components/TransactionConfirmationModal/helpers'
import { AutoRow } from 'components/Row'

const StyledModalHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 10px;
`

interface CancelOrderModalProps {
  onDismiss?: () => void
  onConfirm: () => void
  isOpen?: boolean
}

export default function CancelOrderModal({ onDismiss, onConfirm, isOpen }: CancelOrderModalProps) {
  const defaultOnDismiss = useCallback(
    ($event?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
      $event?.preventDefault()
      onDismiss?.()
    },
    [onDismiss],
  )

  return (
    <Modal onDismiss={defaultOnDismiss} isOpen={isOpen ?? false} maxHeight={90}>
      <Wrapper>
        <StyledModalHeader>
          <ContentHeader onDismiss={defaultOnDismiss}>Cancel Order</ContentHeader>
        </StyledModalHeader>
        <Section>
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Text bold marginBottom={20}>
              Would you like to cancel your order?
            </Text>
            <AutoRow justify="center">
              <Button
                marginX={20}
                onClick={($e) => {
                  $e.preventDefault()
                  onConfirm()
                }}
              >
                Confirm
              </Button>
              <Button
                marginX={20}
                variant="secondary"
                onClick={($e) => {
                  defaultOnDismiss($e)
                }}
              >
                Close
              </Button>
            </AutoRow>
          </Flex>
        </Section>
      </Wrapper>
    </Modal>
  )
}
