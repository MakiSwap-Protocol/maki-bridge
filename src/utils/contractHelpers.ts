import Web3 from 'web3'
import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// -----------------
// Addresses
// -----------------
import {
  getAddress,
  getMakiAddress,
  getMasterChefAddress,
  getMakiVaultAddress,
  getMulticallAddress,
  getProfileAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getClaimRefundAddress,
  getPointCenterIfoAddress
} from 'utils/addressHelpers'

// -----------------
//  ABIs
// -----------------
// Standards
import hrc20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/uni_v2_lp.json'

// Native contracts
import makiAbi from 'config/abi/maki.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefHt from 'config/abi/sousChefHt.json'
import makiVaultAbi from 'config/abi/makiVault.json' // NEEDS TO BE UPDATED W/ MULTICALL V2
import multiCall from 'config/abi/Multicall.json' // NEEDS TO BE UPDATED W/ MULTICALL V2

// Not implemented yet
import profileAbi from 'config/abi/pancakeProfile.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'

// Settings
import { getSettings, getGasPriceInWei } from './settings'

// -----------------
//  Functions
// -----------------
// export const getContract = (abi: any, address: string, web3?: Web3, account?: string) => {
//   const _web3 = web3 ?? web3NoAccount
//   const gasPrice = account ? getSettings(account).gasPrice : DEFAULT_GAS_PRICE

//   return new _web3.eth.Contract(abi as unknown as AbiItem, address, {
//     gasPrice: getGasPriceInWei(gasPrice).toString(),
//   })
// }
const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getHrc20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(hrc20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}
export const getMakiContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(makiAbi, getMakiAddress(), signer)
}
export const getMakiVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(makiVaultAbi, getMakiVaultAddress(), signer)
}
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer)
}
export const getSousChefContract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.HECO ? sousChefHt : sousChef
  return getContract(abi, getAddress(config.contractAddress), signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(multiCall, getMulticallAddress(), signer)
}

// Not implemented yet - here to avoid errors
export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(profileAbi, getProfileAddress(), signer)
}
export const getBunnyFactoryContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), signer)
}
export const getBunnySpecialContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), signer)
}
export const getClaimRefundContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), signer)
}
export const getPointCenterIfoContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer)
}
