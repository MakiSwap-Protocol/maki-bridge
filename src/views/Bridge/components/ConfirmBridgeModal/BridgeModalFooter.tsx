import React, { FunctionComponent } from 'react'
import { AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Button } from 'maki-uikit-v2'
import BridgeSummary from '../BridgeSummary'

interface Props {
  onConfirm: () => void
  disableConfirm: boolean
}

const BridgeModalFooter: FunctionComponent<Props> = ({ disableConfirm, onConfirm }) => {
  return (
    <>
      <AutoColumn>
        <BridgeSummary />
      </AutoColumn>
      <AutoRow>
        <Button
          onClick={onConfirm}
          disabled={disableConfirm}
          variant="primary"
          mt="10px"
          id="confirm-swap-or-send"
          width="100%"
        >
          Confirm Swap
        </Button>
      </AutoRow>
    </>
  )
}

export default BridgeModalFooter
