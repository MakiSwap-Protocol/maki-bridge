import { CurrencyAmount, HUOBI, JSBI } from 'maki-sdk'
import { MIN_HT } from 'config/constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === HUOBI) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_HT)) {
      return CurrencyAmount.huobi(JSBI.subtract(currencyAmount.raw, MIN_HT))
    }
    return CurrencyAmount.huobi(JSBI.BigInt(0))
  }
  return currencyAmount
}

export default maxAmountSpend
