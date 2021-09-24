import { IPair } from './pair.interface';
import { ITransaction } from './transaction.interface';

export interface IMintBurn {

  id: string;
  
  transaction: ITransaction
  
  timestamp: number;
  
  pair: IPair;
  
  to: string;
  
  liquidity: number;
  
  sender: string;
  
  amount0: number;
  
  amount1: number;
  
  logIndex: number;
  
  amountUSD: number;
  
  feeTo: string;
  
  feeLiquidity: number;

  variation?: number;

  type?: string;

}