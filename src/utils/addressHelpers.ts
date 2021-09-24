import { MAINNET_CHAIN_ID } from 'config'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[MAINNET_CHAIN_ID]
}

// Native
export const getWhtAddress = () => {
  return getAddress(tokens.wht.address)
}
export const getMakiAddress = () => {
  return getAddress(tokens.maki.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}

// Awaiting Implementation
export const getMakiVaultAddress = () => {
  return getAddress(addresses.makiVault)
}
export const getProfileAddress = () => {
  return getAddress(addresses.makiProfile)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}

export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}
// export const getLotteryTicketAddress = () => {
//   return getAddress(addresses.lotteryNFT)
// }
// export const getPancakeRabbitsAddress = () => {
//   return getAddress(addresses.pancakeRabbits)
// }
// export const getClaimRefundAddress = () => {
//   return getAddress(addresses.claimRefund)
// }
// export const getBunnySpecialAddress = () => {
//   return getAddress(addresses.bunnySpecial)
// }
