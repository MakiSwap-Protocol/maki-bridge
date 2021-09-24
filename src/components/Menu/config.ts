import { MenuEntry } from 'maki-toolkit'
import { ContextApi } from 'contexts/Localization/types'

const MAKISWAP_URL = 'https://app.makiswap.com'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: MAKISWAP_URL,
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    href: 'https://exchange.makiswap.com',
    items: [
      {
        label: t('Exchange'),
        href: `${MAKISWAP_URL}/swap`,
      },
      {
        label: t('Liquidity'),
        href: `${MAKISWAP_URL}/pool`,
      },
      {
        label: t('Limit'),
        href: `${MAKISWAP_URL}/limit`,
      },
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: `${MAKISWAP_URL}/farms`,
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    href: `${MAKISWAP_URL}/pools`,
  },
  {
    label: t('Contracts'),
    icon: 'ContractsIcon',
    items: [
      {
        label: 'MakiToken.sol',
        href: 'https://hecoinfo.com/address/0x5FaD6fBBA4BbA686bA9B8052Cf0bd51699f38B93#code',
      },
      {
        label: 'SoyBar.sol',
        href: 'https://hecoinfo.com/address/0xfb4C85B31b888e4F84aC131667865E029D6486F7#code',
      },
      {
        label: 'MasterChef.sol',
        href: 'https://hecoinfo.com/address/0x4cb4c9C8cC67B171Ce86eB947cf558AFDBcAB17E/#code',
      },
      {
        label: 'MakiswapFactory.sol',
        href: 'https://hecoinfo.com/address/0x11cdc9bd86ff68b6a6152037342bae0c3a717f56#code',
      },
      {
        label: 'MakiswapRouter.sol',
        href: 'https://hecoinfo.com/address/0x7F88bC12aa1Ed9fF4605123649Ac90F2Cd9407eB/#code',
      },
    ],
  },
  {
    label: t('Audits'),
    icon: 'GroupsIcon',
    items: [
      {
        label: t('Chainsulting'),
        href: 'https://github.com/chainsulting/Smart-Contract-Security-Audits/blob/master/MakiSwap/02_Smart%20Contract%20Audit_MakiSwap.pdf',
      },
      {
        label: t('Certik'),
        href: 'https://www.certik.org/projects/makiswap',
      },
    ],
  },
  {
    label: 'IFO',
    icon: 'IfoIcon',
    href: `${MAKISWAP_URL}/ifo`,
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    items: [
      {
        label: t('Overview'),
        href: 'https://info.makiswap.com',
      },
      {
        label: t('Tokens'),
        href: 'https://info.makiswap.com/tokens',
      },
      {
        label: t('Pairs'),
        href: 'https://info.makiswap.com/pairs',
      },
      {
        label: t('Accounts'),
        href: 'https://info.makiswap.com/accounts',
      },
    ],
  },
  {
    label: t('Bridge'),
    icon: 'BridgeIcon',
    href: '/bridge',
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Docs'),
        href: 'https://docs.makiswap.com/',
      },
      {
        label: t('Github'),
        href: 'https://github.com/MakiSwap-Protocol',
      },
      {
        label: t('Contact'),
        href: 'https://docs.makiswap.com/jiro-ono/contact-us/business-and-partnerships',
      },
    ],
  },
]

export default config
