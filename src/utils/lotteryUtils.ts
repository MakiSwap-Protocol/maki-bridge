/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js'
import { Interface } from '@ethersproject/abi'
import ticketAbi from 'config/abi/lotteryNft.json'
import lotteryAbi from 'config/abi/lottery.json'
import { DEFAULT_TOKEN_DECIMAL, LOTTERY_TICKET_PRICE } from 'config'
import { getMulticallContract } from 'utils/contractHelpers'
import { BIG_ZERO } from './bigNumber'

export const multiCall = async (abi, calls) => {
  const multi = getMulticallContract()
  const itf = new Interface(abi)
  let res = []
  if (calls.length > 100) {
    let i = 0
    while (i < calls.length / 100) {
      const newCalls = calls.slice(i * 100, 100 * (i + 1))
      const calldata = newCalls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
      const { returnData } = await multi.aggregate(calldata)
      i++
      res = res.concat(returnData.map((call, index) => itf.decodeFunctionResult(newCalls[index][1], call)))
    }
  } else {
    const calldata = calls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
    const { returnData } = await multi.aggregate(calldata)
    res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i][1], call))
  }
  return res
}

export const multiBuy = async (lotteryContract, price, numbersList, account) => {
  try {
    return lotteryContract
      .multiBuy(new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL).toString(), numbersList)
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } catch (err) {
    return console.error(err)
  }
}

export const getTickets = async (lotteryContract, ticketsContract, account, customLotteryNum) => {
  const issueIndex = customLotteryNum || (await lotteryContract.issueIndex())
  const length = await getTicketsAmount(ticketsContract, account)

  // eslint-disable-next-line prefer-spread
  const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => [
    ticketsContract.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ])
  const res = await multiCall(ticketAbi, calls1)

  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getLotteryIssueIndex', [id]])
  const ticketIssues = await multiCall(ticketAbi, calls2)

  const finalTokenids = []
  ticketIssues.forEach(async (ticketIssue, i) => {
    if (new BigNumber(ticketIssue).eq(issueIndex)) {
      finalTokenids.push(tokenIds[i])
    }
  })
  const calls3 = finalTokenids.map((id) => [ticketsContract.address, 'getLotteryNumbers', [id]])
  const tickets = await multiCall(ticketAbi, calls3)

  await getLotteryStatus(lotteryContract)
  return tickets
}

export const getTicketsAmount = async (ticketsContract, account) => {
  return ticketsContract.balanceOf(account)
}

export const multiClaim = async (lotteryContract, ticketsContract, account) => {
  await lotteryContract.issueIndex()
  const length = await getTicketsAmount(ticketsContract, account)
  // eslint-disable-next-line prefer-spread
  const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => [
    ticketsContract.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ])
  const res = await multiCall(ticketAbi, calls1)
  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getClaimStatus', [id]])
  const claimedStatus = await multiCall(ticketAbi, calls2)

  const unClaimedIds = tokenIds.filter((id, index) => !claimedStatus[index][0])

  const calls3 = unClaimedIds.map((id) => [lotteryContract.address, 'getRewardView', [id]])
  const rewards = await multiCall(lotteryAbi, calls3)

  let finalTokenIds = []
  rewards.forEach((r, i) => {
    if (r > 0) {
      finalTokenIds.push(unClaimedIds[i])
    }
  })

  if (finalTokenIds.length > 200) {
    finalTokenIds = finalTokenIds.slice(0, 200)
  }

  try {
    return lotteryContract.multiClaim(finalTokenIds)
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } catch (err) {
    return console.error(err)
  }
}

export const getTotalClaim = async (lotteryContract, ticketsContract, account) => {
  try {
    const issueIndex = await lotteryContract.issueIndex()
    const length = await getTicketsAmount(ticketsContract, account)
    // eslint-disable-next-line prefer-spread
    const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => [
      ticketsContract.address,
      'tokenOfOwnerByIndex',
      [account, i],
    ])
    const res = await multiCall(ticketAbi, calls1)
    const tokenIds = res.map((id) => id.toString())
    const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getLotteryIssueIndex', [id]])
    const ticketIssues = await multiCall(ticketAbi, calls2)
    const calls3 = tokenIds.map((id) => [ticketsContract.address, 'getClaimStatus', [id]])
    const claimedStatus = await multiCall(ticketAbi, calls3)

    const drawed = await getLotteryStatus(lotteryContract)

    const finalTokenIds = []
    ticketIssues.forEach(async (ticketIssue, i) => {
      // eslint-disable-next-line no-empty
      if (!drawed && ticketIssue.toString() === issueIndex) {
      } else if (!claimedStatus[i][0]) {
        finalTokenIds.push(tokenIds[i])
      }
    })

    const calls4 = finalTokenIds.map((id) => [lotteryContract.address, 'getRewardView', [id]])

    const rewards = await multiCall(lotteryAbi, calls4)
    const claim = rewards.reduce((p, c) => BigNumber.sum(p, c), BIG_ZERO)

    return claim
  } catch (err) {
    console.error(err)
  }
  return BIG_ZERO
}

export const getTotalRewards = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  return lotteryContract.getTotalRewards(issueIndex)
}

export const getMax = async (lotteryContract) => {
  return lotteryContract.maxNumber()
}

export const getLotteryIssueIndex = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  return issueIndex
}

export const getLotteryStatus = async (lotteryContract) => {
  return lotteryContract.drawed()
}

export const getMatchingRewardLength = async (lotteryContract, matchNumber) => {
  let issueIndex = await lotteryContract.issueIndex()
  const drawed = await lotteryContract.drawed()
  if (!drawed) {
    issueIndex -= 1
  }
  try {
    const amount = await lotteryContract.historyAmount(issueIndex, 5 - matchNumber)

    return new BigNumber(amount).div(DEFAULT_TOKEN_DECIMAL).div(LOTTERY_TICKET_PRICE).toNumber()
  } catch (err) {
    console.error(err)
  }
  return 0
}

export const getWinningNumbers = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  const numbers = []
  const drawed = await lotteryContract.drawed()

  if (!drawed && parseInt(issueIndex, 10) === 0) {
    return [0, 0, 0, 0]
  }
  if (!drawed) {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.historyNumbers(issueIndex - 1, i)).toString())
    }
  } else {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.winningNumbers(i)).toString())
    }
  }
  return numbers
}
