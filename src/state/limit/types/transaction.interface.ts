import { IMintBurn } from "./mb.interface";
import { ISwap } from "./swap.interface";

export interface ITransaction {

  id: string;
 
  blockNumber: number;
 
  timestamp: number;
 
  mints: IMintBurn[];
 
  burns: IMintBurn[];
 
  swaps: ISwap[]

}