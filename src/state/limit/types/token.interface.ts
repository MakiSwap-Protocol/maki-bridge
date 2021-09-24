export interface IToken {
  
  id: string;

  name: string;
  
  address: string;

  chainId: number;

  symbol: string;

  decimals: number;

  derivedETH: number;

  logoURI?: string;

  totalSupply?: number;

  circulatingSupply?: number;

  tradeVolume?: number;

  tradeVolumeUSD?: number;

  totalLiquidity?: number;

  priceUSD?: number;

  priceChange?: number;

  reserveUSD?: number;

}
