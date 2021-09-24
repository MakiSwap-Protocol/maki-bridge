import { Currency, HUOBI, Token } from 'maki-sdk'

export function currencyId(currency: Currency): string {
  if (currency === HUOBI) return 'HT'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
