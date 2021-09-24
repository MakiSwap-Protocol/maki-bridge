import BigNumber from 'bignumber.js'
import { convertSharesToMaki } from 'views/Pools/helpers'
import { getMakiVaultContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import { getMakiVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import makiVaultAbi from 'config/abi/makiVault.json'

const makiVaultContract = getMakiVaultContract()

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestMakiRewards',
      'calculateTotalPendingMakiRewards',
    ].map((method) => ({
      address: getMakiVaultAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedMakiBountyReward], [totalPendingMakiHarvest]] = await multicallv2(
      makiVaultAbi,
      calls,
    )

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalMakiInVaultEstimate = convertSharesToMaki(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalMakiInVault: totalMakiInVaultEstimate.makiAsBigNumber.toJSON(),
      estimatedMakiBountyReward: new BigNumber(estimatedMakiBountyReward as string).toJSON(),
      totalPendingMakiHarvest: new BigNumber(totalPendingMakiHarvest as string).toJSON(),
    }
  } catch (error) {
    console.log('!!', error)
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalMakiInVault: null,
      estimatedMakiBountyReward: null,
      totalPendingMakiHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = [
      'performanceFee',
      'callFee',
      'withdrawFee',
      'withdrawFeePeriod',
    ].map((method) => ({
      address: getMakiVaultAddress(),
      name: method,
    }))
    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(
      makiVaultAbi,
      calls,
    )

    return {
      performanceFee: parseInt(performanceFee as string, 10),
      callFee: parseInt(callFee as string, 10),
      withdrawalFee: parseInt(withdrawalFee as string, 10),
      withdrawalFeePeriod: parseInt(withdrawalFeePeriod as string, 10),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
