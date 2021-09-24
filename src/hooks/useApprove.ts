import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
// import { Contract } from 'web3-eth-contract'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useMasterchef, useMaki, useSousChef, useLottery, useMakiVaultContract } from './useContract'
import useToast from './useToast'
import useLastUpdated from './useLastUpdated'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      // const tx = await approve(lpContract, masterChefContract, account)
      // return tx.transactionHash
      const tx = await lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      return false
    }
  }, [lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId, earningTokenSymbol) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      if (tx) {
        toastSuccess(
          ('Contract Enabled'),
          // eslint-disable-next-line
          ('You can now stake in the pool: ' + { symbol: earningTokenSymbol }),
        )
        setRequestedApproval(false)
      } else {
        // user rejected tx or didn't go thru
        toastError(('Error'), ('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
      toastError(('Error'), e?.message)
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId, earningTokenSymbol, toastError, toastSuccess])

  return { handleApprove, requestedApproval }
}

// Approve MAKI auto pool
export const useVaultApprove = (setLastUpdated: () => void) => {
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const makiVaultContract = useMakiVaultContract()
  const makiContract = useMaki()

  const handleApprove = async () => {
    try {
      setRequestedApproval(true)
      const tx = await makiContract.approve(makiVaultContract.address, ethers.constants.MaxUint256, { from: account })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess('Contract Enabled', 'You can now stake in the MAKI vault!')
        setLastUpdated()
        setRequestedApproval(false)
      } else {
        toastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
        setRequestedApproval(false)
      }
    } catch (e) {
      toastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
    }
  }

  return { handleApprove, requestedApproval }
}

export const useCheckVaultApprovalStatus = () => {
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const { account } = useWeb3React()
  const makiContract = useMaki()
  const makiVaultContract = useMakiVaultContract()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await makiContract.allowance(account, makiVaultContract.address)
        const currentAllowance = new BigNumber(response)
        setIsVaultApproved(currentAllowance.gt(0))
      } catch (error) {
        setIsVaultApproved(false)
      }
    }

    checkApprovalStatus()
  }, [account, makiContract, makiVaultContract, lastUpdated])

  return { isVaultApproved, setLastUpdated }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React()
  const makiContract = useMaki()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(makiContract, lotteryContract, account)
      return tx.transactionHash
    } catch (e) {
      return false
    }
  }, [account, makiContract, lotteryContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
// export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
//   const { account } = useWeb3React()
//   const onApprove = useCallback(async () => {
//     const tx = await tokenContract.methods.approve(spenderAddress, ethers.constants.MaxUint256).send({ from: account })
//     return tx
//   }, [account, spenderAddress, tokenContract])

//   return onApprove
// }
