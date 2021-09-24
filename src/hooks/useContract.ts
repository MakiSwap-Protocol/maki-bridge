import { useMemo } from 'react'
import { AbiItem } from 'web3-utils'
import { Contract } from '@ethersproject/contracts'
import { ChainId, WHT } from 'maki-sdk'
import { abi as IMakiswapPairABI } from 'makiswap-core/build/IMakiswapPair.json'
import Merkle from 'config/constants/merkle'

// ABIs
import HRC20_ABI from 'config/abi/hrc20.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefHt from 'config/abi/sousChefHt.json'
import makiVault from 'config/abi/makiVault.json'
import profile from 'config/abi/pancakeProfile.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import ENS_ABI from 'config/abi/ens-registrar.json'
import LIMIT_ABI from 'config/abi/limit-order.abi.json'
import ENS_PUBLIC_RESOLVER_ABI from 'config/abi/ens-public-resolver.json'
import {HRC20_BYTES32_ABI } from 'config/abi/hrc20'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from 'config/abi/migrator'
import WHT_ABI from 'config/abi/wht.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from 'config/constants/multicall'
import { getContract } from 'utils'

// Addresses
import {
  getAddress,
  getMasterChefAddress,
  getMakiAddress,
  getMakiVaultAddress,
  getProfileAddress,
  getLotteryAddress,
} from 'utils/addressHelpers'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import { useActiveWeb3React } from '.'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useLimitContract(): Contract | null {
  const contract = useContract("0xFa311750A0E1d2b8B979678Ec1A04F56aC8DB866", LIMIT_ABI, true);
  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */
export const useHRC20 = (address: string) => {
  const hrc20Abi = (HRC20_ABI as unknown) as AbiItem
  return useContract(address, hrc20Abi)
}

export const useMaki = () => {
  return useHRC20(getMakiAddress())
}

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem
  return useContract(getMasterChefAddress(), abi)
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.HECO ? sousChefHt : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(getAddress(config.contractAddress), abi)
}

// FIX ** NEED TO ADD
export const useMakiVaultContract = () => {
  const abi = (makiVault as unknown) as AbiItem
  return useContract(getMakiVaultAddress(), abi)
}

// Pancake
// export const useIfoContract = (address: string) => {
//   const ifoAbi = (hrc20 as unknown) as AbiItem
//   return useContract(ifoAbi, address)
// }

// export const useBunnyFactory = () => {
//   const bunnyFactoryAbi = (hrc20 as unknown) as AbiItem
//   return useContract(bunnyFactoryAbi, getMakiAddress())
// }

// export const usePancakeRabbits = () => {
//   const pancakeRabbitsAbi = (hrc20 as unknown) as AbiItem
//   return useContract(pancakeRabbitsAbi, getMakiAddress())
// }

export const useProfile = () => {
  const abi = (profile as unknown) as AbiItem
  return useContract(getProfileAddress(), abi)
}

export const useLottery = () => {
  const abi = (lottery as unknown) as AbiItem
  return useContract(getLotteryAddress(), abi)
}

export const useLotteryTicket = () => {
  const abi = (lotteryTicket as unknown) as AbiItem
  return useContract(getLotteryAddress(), abi) // UPDATE get()
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, HRC20_ABI, withSignerIfPossible)
}

export function useWHTContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WHT[chainId].address : undefined, WHT_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, HRC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IMakiswapPairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export const useMerkleDistributorContract = () => {
  return useContract(Merkle.contractAddress, Merkle.contractABI)
}

export default useContract
