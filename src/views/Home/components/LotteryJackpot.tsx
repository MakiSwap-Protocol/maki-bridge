import React from 'react'
// import { Text } from 'maki-uikit-v2'
// import { getBalanceNumber } from 'utils/formatBalance'
// import { useTotalRewards } from 'hooks/useTickets'
// import { usePriceMakiHusd } from 'state/hooks'
// import { BigNumber } from 'bignumber.js'
// import CardHusdValue from './CardHusdValue'

// const LotteryJackpot = () => {
//   const lotteryPrizeAmount = useTotalRewards()
//   const balance = getBalanceNumber(lotteryPrizeAmount)
//   const lotteryPrizeAmoutMaki = balance.toLocaleString(undefined, {
//     maximumFractionDigits: 2,
//   })
//   const lotteryPrizeAmountHusd = new BigNumber(balance).multipliedBy(usePriceMakiHusd()).toNumber()

//   return (
//     <>
//       <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
//         {lotteryPrizeAmoutMaki} MAKI
//       </Text>
//       <CardHusdValue value={lotteryPrizeAmountHusd} />
//     </>
//   )
// }

// export default LotteryJackpot
