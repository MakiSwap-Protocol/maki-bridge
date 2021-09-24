import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { HUOBI } from 'maki-sdk'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
// import { orderBy } from 'lodash'
// import { Team } from 'config/constants/types'
// import Nfts from 'config/constants/nfts'
import { farmsConfig } from 'config/constants'
import web3NoAccount from 'utils/web3'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { useAllTokens } from 'hooks/Tokens'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchMakiVaultPublicData,
  fetchMakiVaultUserData,
  fetchMakiVaultFees,
  setBlock,
} from './actions'
import { State, Farm, Pool, FarmsState } from './types'
import { transformPool } from './pools/helpers'
import { fetchPoolsStakingLimitsAsync } from './pools'
import { fetchFarmUserDataAsync, nonArchivedFarms } from './farms'

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 1 = MAKI-HT LP
 * 4 = HUSD-HT LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([1, 4]))
  }, [dispatch, fastRefresh])
}

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3NoAccount.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

// Return the base token price for a farm, from a given pid
export const useHusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.husdPrice)
}

export const useHusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useHusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useHusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await web3NoAccount.eth.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }

    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return transformPool(pool)
}

export const useFetchMakiVault = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchMakiVaultPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchMakiVaultUserData({ account }))
  }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchMakiVaultFees())
  }, [dispatch])
}

export const useMakiVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalMakiInVault: totalMakiInVaultAsString,
    estimatedMakiBountyReward: estimatedMakiBountyRewardAsString,
    totalPendingMakiHarvest: totalPendingMakiHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      makiAtLastUserAction: makiAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.makiVault)

  const estimatedMakiBountyReward = useMemo(() => {
    return new BigNumber(estimatedMakiBountyRewardAsString)
  }, [estimatedMakiBountyRewardAsString])

  const totalPendingMakiHarvest = useMemo(() => {
    return new BigNumber(totalPendingMakiHarvestAsString)
  }, [totalPendingMakiHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalMakiInVault = useMemo(() => {
    return new BigNumber(totalMakiInVaultAsString)
  }, [totalMakiInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const makiAtLastUserAction = useMemo(() => {
    return new BigNumber(makiAtLastUserActionAsString)
  }, [makiAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalMakiInVault,
    estimatedMakiBountyReward,
    totalPendingMakiHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      makiAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

// Profile

// export const useFetchProfile = () => {
//   const { account } = useWeb3React()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchProfile(account))
//   }, [account, dispatch])
// }

// export const useProfile = () => {
//   const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
//   return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
// }

// Teams

// export const useTeam = (id: number) => {
//   const team: Team = useSelector((state: State) => state.teams.data[id])
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchTeam(id))
//   }, [id, dispatch])

//   return team
// }

// export const useTeams = () => {
//   const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchTeams())
//   }, [dispatch])

//   return { teams: data, isInitialized, isLoading }
// }

// Achievements

// export const useFetchAchievements = () => {
//   const { account } = useWeb3React()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (account) {
//       dispatch(fetchAchievements(account))
//     }
//   }, [account, dispatch])
// }

// export const useAchievements = () => {
//   const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
//   return achievements
// }

export const usePriceHtHusd = (): BigNumber => {
  const htHusdFarm = useFarmFromPid(4) // HUSD-HT LP
  return new BigNumber(htHusdFarm.quoteToken.husdPrice)
}

export const usePriceMakiHusd = (): BigNumber => {
  const makiHusdFarm = useFarmFromPid(3) // MAKI-HUSD LP
  return new BigNumber(makiHusdFarm.token.husdPrice)
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Predictions
// export const useIsHistoryPaneOpen = () => {
//   return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
// }

// export const useIsChartPaneOpen = () => {
//   return useSelector((state: State) => state.predictions.isChartPaneOpen)
// }

// export const useGetRounds = () => {
//   return useSelector((state: State) => state.predictions.rounds)
// }

// export const useGetSortedRounds = () => {
//   const roundData = useGetRounds()
//   return orderBy(Object.values(roundData), ['epoch'], ['asc'])
// }

// export const useGetCurrentEpoch = () => {
//   return useSelector((state: State) => state.predictions.currentEpoch)
// }

// export const useGetIntervalBlocks = () => {
//   return useSelector((state: State) => state.predictions.intervalBlocks)
// }

// export const useGetBufferBlocks = () => {
//   return useSelector((state: State) => state.predictions.bufferBlocks)
// }

// export const useGetTotalIntervalBlocks = () => {
//   const intervalBlocks = useGetIntervalBlocks()
//   const bufferBlocks = useGetBufferBlocks()
//   return intervalBlocks + bufferBlocks
// }

// export const useGetRound = (id: string) => {
//   const rounds = useGetRounds()
//   return rounds[id]
// }

// export const useGetCurrentRound = () => {
//   const currentEpoch = useGetCurrentEpoch()
//   const rounds = useGetSortedRounds()
//   return rounds.find((round) => round.epoch === currentEpoch)
// }

// export const useGetPredictionsStatus = () => {
//   return useSelector((state: State) => state.predictions.status)
// }

// export const useGetHistoryFilter = () => {
//   return useSelector((state: State) => state.predictions.historyFilter)
// }

// export const useGetCurrentRoundBlockNumber = () => {
//   return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
// }

// export const useGetMinBetAmount = () => {
//   const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
//   return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
// }

// export const useGetIsFetchingHistory = () => {
//   return useSelector((state: State) => state.predictions.isFetchingHistory)
// }

// export const useGetHistory = () => {
//   return useSelector((state: State) => state.predictions.history)
// }

// export const useGetHistoryByAccount = (account: string) => {
//   const bets = useGetHistory()
//   return bets ? bets[account] : []
// }

// export const useGetBetByRoundId = (account: string, roundId: string) => {
//   const bets = useSelector((state: State) => state.predictions.bets)

//   if (!bets[account]) {
//     return null
//   }

//   if (!bets[account][roundId]) {
//     return null
//   }

//   return bets[account][roundId]
// }

// export const useBetCanClaim = (account: string, roundId: string) => {
//   const bet = useGetBetByRoundId(account, roundId)

//   if (!bet) {
//     return false
//   }

//   return getCanClaim(bet)
// }

// export const useGetLastOraclePrice = (): BigNumber => {
//   const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
//   return new BigNumber(lastOraclePrice)
// }

// // Collectibles
// export const useGetCollectibles = () => {
//   const { account } = useWeb3React()
//   const dispatch = useAppDispatch()
//   const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
//   const identifiers = Object.keys(data)

//   useEffect(() => {
//     // Fetch nfts only if we have not done so already
//     if (!isInitialized) {
//       dispatch(fetchWalletNfts(account))
//     }
//   }, [isInitialized, account, dispatch])

//   return {
//     isInitialized,
//     isLoading,
//     tokenIds: data,
//     nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  // }
// }
