import { Interface } from '@ethersproject/abi'
import LIMIT_ABI from '../abi/limit-order.abi.json'

const LIMIT_INTERFACE = new Interface(LIMIT_ABI)
export default LIMIT_INTERFACE
export { LIMIT_ABI }