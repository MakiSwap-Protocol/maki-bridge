// Set of helper functions to facilitate wallet setup

import { BASE_HECO_INFO_URL } from 'config'
import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add HECO as a network on Metamask, or switch to HECO if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = (window as WindowChain).huobi
  const { ethereum } = (window as any)
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Huobi Smart Chain Mainnet',
            nativeCurrency: {
              name: 'Huobi Token',
              symbol: 'HT',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${BASE_HECO_INFO_URL}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else if (ethereum) {
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Huobi Smart Chain Mainnet',
            nativeCurrency: {
              name: 'Huobi Token',
              symbol: 'HT',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${BASE_HECO_INFO_URL}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the HECO network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
 export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const tokenAdded = await (window as WindowChain).huobi.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'HRC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}