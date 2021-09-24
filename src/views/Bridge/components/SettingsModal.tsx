import React from 'react'
import { Modal } from 'maki-toolkit'
import { useInSlippageTolerance, useOutSlippageTolerance } from 'state/persist/hooks'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal: React.FC<SettingsModalProps> = ({ onDismiss = defaultOnDismiss }: SettingsModalProps) => {
  const [inTolerance, setInTolerance] = useInSlippageTolerance()
  const [outTolerance, setOutTolerance] = useOutSlippageTolerance()
  return (
    <Modal title="Settings" onDismiss={onDismiss}>
      <SlippageToleranceSetting
        userSlippageTolerance={inTolerance}
        setUserslippageTolerance={setInTolerance}
        title="First Slippage Tolerance"
      />
      <SlippageToleranceSetting
        userSlippageTolerance={outTolerance}
        setUserslippageTolerance={setOutTolerance}
        title="Second Slippage Tolerance"
      />
      <TransactionDeadlineSetting />
    </Modal>
  )
}

export default SettingsModal
