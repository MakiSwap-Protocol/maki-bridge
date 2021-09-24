import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorNames } from 'maki-uikit-v2'
import { ethers } from 'ethers'
import { mapChainIdToNames } from 'views/Bridge/constant'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const injected = new InjectedConnector({
  supportedChainIds: Object.keys(mapChainIdToNames).map((chain) => Number(chain)),
})

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  // bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}
