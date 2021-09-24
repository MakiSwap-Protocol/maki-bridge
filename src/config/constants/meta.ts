import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Makiswap',
  description:
    'The most popular AMM on HECO by user count! Earn MAKI through yield farming or win it in the Lottery, then stake it in Soy Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Makiswap), NFTs, and more, on a platform you can trust.',
  image: 'https://makiswap.com/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Makiswap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Makiswap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Makiswap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Makiswap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Makiswap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Makiswap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Makiswap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Makiswap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Makiswap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Makiswap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Makiswap')}`,
      }
    default:
      return null
  }
}
