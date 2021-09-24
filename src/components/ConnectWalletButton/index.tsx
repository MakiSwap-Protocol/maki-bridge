import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, ConnectorNames, useWalletModal } from 'maki-toolkit'
import { injected, walletconnect } from 'connectors'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId) => {
    if (connectorId === ConnectorNames.WalletConnect) {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      Unlock Wallet
    </Button>
  )
}

export default UnlockButton
