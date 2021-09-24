import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import hrc20ABI from 'config/abi/hrc20.json'
import multicall from 'utils/multicall'
import { getMasterchefContract } from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import web3NoAccount from 'utils/web3'
import BigNumber from 'bignumber.js'

// Pool 0, Maki / Maki is a different kind of contract (master chef)
// HT pools use the native HT token (wrapping ? unwrapping is done at the contract level)
const nonHtPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'HT')
const htPools = poolsConfig.filter((p) => p.stakingToken.symbol === 'HT')
const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
const masterChefContract = getMasterchefContract()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonHtPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(hrc20ABI, calls)
  return nonHtPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non HT pools
  const calls = nonHtPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(hrc20ABI, calls)
  const tokenBalances = nonHtPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // HT pools
  const htBalance = await web3NoAccount.eth.getBalance(account)
  const htBalances = htPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(htBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...htBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)

  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Maki / Maki pool
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Maki / Maki pool
  const pendingReward = await masterChefContract.pendingMaki('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
}
