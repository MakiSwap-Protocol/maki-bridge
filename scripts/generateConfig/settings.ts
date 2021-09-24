import { SettingsObject, SettingsType } from './types'

const BASE_URL = 'https://app.makiswap.com'
const settings: SettingsObject[] = [
  {
    name: 'farms',
    url: `${BASE_URL}/farms`,
    type: SettingsType.FARM,
  },
  {
    name: 'pools',
    url: `${BASE_URL}/pools`,
    type: SettingsType.POOL,
  },
  {
    name: 'ifos',
    url: `${BASE_URL}/ifos`,
    type: SettingsType.IFO,
  },
]
export default settings
