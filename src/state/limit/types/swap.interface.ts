import { ITransaction } from "./transaction.interface";

export interface ISwap {

  id: string;
  
  transaction: ITransaction;
  
  timestamp: number;
  
  // pair: Pair!
  
  sender: string;
  
  from: string;
  
  amount0In: number;
  
  amount1In: number;
  
  amount0Out: number;
  
  amount1Out: number;
  
  to: string;
  
  logIndex: number;
  
  amountUSD: number;

}