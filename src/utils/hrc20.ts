import Web3 from 'web3'
import { provider as ProviderType } from 'web3-core'
import { Contract } from 'ethers'
import { AbiItem } from 'web3-utils'
import { getContract } from 'utils'
import hrc20 from 'config/abi/hrc20.json'

// export const getContract = (provider: ProviderType, address: string) => {
//   const web3 = new Web3(provider)
//   const contract = new web3.eth.Contract((hrc20 as unknown) as AbiItem, address)
//   return contract
// }

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.allowance(account, masterChefContract.address)
    return allowance
  } catch (e) {
    return '0'
  }
}
