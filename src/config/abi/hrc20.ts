import { Interface } from '@ethersproject/abi'
import HRC20_ABI from './hrc20.json'
import HRC20_BYTES32_ABI from './hrc20_bytes32.json'

const HRC20_INTERFACE = new Interface(HRC20_ABI)

const HRC20_BYTES32_INTERFACE = new Interface(HRC20_BYTES32_ABI)

export default HRC20_INTERFACE
export { HRC20_ABI, HRC20_BYTES32_INTERFACE, HRC20_BYTES32_ABI }
