import { ChainId } from 'maki-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xC678588909d18879E7ce9a5c11e89264900ec13D', // UPDATED
  [ChainId.TESTNET]: '0xb5ec65821e27de5ec9d52d5826057a99bd78c875'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
