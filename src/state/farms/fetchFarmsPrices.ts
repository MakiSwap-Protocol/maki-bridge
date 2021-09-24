import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { Farm } from 'state/types'

const getFarmFromTokenSymbol = (farms: Farm[], tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (farm: Farm, quoteTokenFarm: Farm, htPriceHusd: BigNumber): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === 'HUSD') {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'HT') {
    return hasTokenPriceVsQuote ? htPriceHusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for HUSD/HT farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't HUSD or WHT, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - HT, (pBTC - HT)
  // from the HT - pBTC price, we can calculate the PNT - HUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'HT') {
    const quoteTokenInHusd = htPriceHusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInHusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInHusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'HUSD') {
    const quoteTokenInHusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInHusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInHusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed HUSD/WHT quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (farm: Farm, quoteTokenFarm: Farm, htPriceHusd: BigNumber): BigNumber => {
  if (farm.quoteToken.symbol === 'HUSD') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'HT') {
    return htPriceHusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'HT') {
    return quoteTokenFarm.tokenPriceVsQuote ? htPriceHusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'HUSD') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchFarmsPrices = async (farms) => {
  const htHusdFarm = farms.find((farm: Farm) => farm.pid === 4)
  const htPriceHusd = htHusdFarm.tokenPriceVsQuote ? BIG_ONE.div(htHusdFarm.tokenPriceVsQuote) : BIG_ZERO

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, htPriceHusd)
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, htPriceHusd)
    const token = { ...farm.token, husdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...farm.quoteToken, husdPrice: quoteTokenPrice.toJSON() }
    return { ...farm, token, quoteToken }
  })

  return farmsWithPrices
}

export default fetchFarmsPrices
