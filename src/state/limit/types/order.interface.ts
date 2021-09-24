import { EOrderState, EOrderStatus, EOrderType } from "../enums";
import { IToken } from "./token.interface";

export interface IOrder {

  id: number;

  tokenIn: IToken;

  tokenOut: IToken;

  tokenInAmount: number;

  tokenOutAmount: number;

  price: number;

  type: EOrderType;

  state: EOrderState;

  status: EOrderStatus;

  trader: string;

  timestamp: number;

  txHash?: string;

}