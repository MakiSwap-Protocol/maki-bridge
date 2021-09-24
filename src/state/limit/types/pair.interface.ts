import { IMintBurn } from "./mb.interface";
import { ISwap } from "./swap.interface";
import { IToken } from "./token.interface";

export interface IPair {

  id: string;

  token0: IToken;

  token1: IToken;

  reserve0: number;

  reserve1: number;

  totalSupply: number;

  reserveETH: number;

  reserveUSD: number;

  trackedReserveETH: number;

  token0Price: number;

  token1Price: number;

  volumeToken0: number;

  volumeToken1: number;

  volumeUSD: number;

  untrackedVolumeUSD: number;

  txCount: number;

  createdAtTimestamp: number;

  createdAtBlockNumber: number;

  // pairHourData: [PairHourData!]!

  mints: IMintBurn[];

  burns: IMintBurn[];

  swaps: ISwap[];

}