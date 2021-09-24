import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
    /**
   * These 3 farms (PID 0, 1, 4) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'MAKI',
    lpAddresses: {
      256: '0x6858a26bBBc8e185274969f6baf99674929Cf766',
      128: '0x5fad6fbba4bba686ba9b8052cf0bd51699f38b93', // June 15th, 2021
    },
    token: tokens.maki,
    quoteToken: tokens.wht,
  },
  {
    pid: 1,
    lpSymbol: 'MAKI-HT',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad',
      128: '0xC923E7Dd24A96Da2136Cbc3C99F544F225A46424',
    },
    token: tokens.maki,
    quoteToken: tokens.wht,
  },
  {
    pid: 42,
    lpSymbol: 'MAKI-LINK',
    lpAddresses: {
      256: '',
      128: '0xFa1bFDbC83006eC3b5F2691BC02333BB89958C6c',
    },
    token: tokens.maki,
    quoteToken: tokens.link
  },
  {
    pid: 40,
    lpSymbol: 'MAKI-PTD',
    lpAddresses: {
      256: '',
      128: '0x06AD6a9F784b5d66de44cfD01F99daC7347c3D23'
    },
    token: tokens.ptd,
    quoteToken: tokens.maki
  },
  {
    pid: 35,
    lpSymbol: 'BTC-USDT',
    lpAddresses: {
      256: '',
      128: '0xE2AA9f6423D38B9Eaf743c34e69Ca53A284bAa6a',
    },
    token: tokens.btc,
    quoteToken: tokens.usdt,
  },
  {
    pid: 34,
    lpSymbol: 'MAKI-LAYER',
    lpAddresses: {
      256: '',
      128: '0x5a4a29EcFde14D0aBe20B5357bC1Cbd0B57cf212', // July 5nd, 2021
    },
    token: tokens.layer,
    quoteToken: tokens.maki,
  },
  {
    pid: 33,
    lpSymbol: 'MAKI-DAI',
    lpAddresses: {
      256: '',
      128: '0xC97C03c42FD2f55b6FA2eA6e858C7E2bc00305c7', // July 5nd, 2021
    },
    token: tokens.dai,
    quoteToken: tokens.maki,
  },
  {
    pid: 32,
    lpSymbol: 'MAKI-LTC',
    lpAddresses: {
      256: '',
      128: '0x486D5f255CBE45F92f6A4fcefe9c98e9c7c8d821', // July 4nd, 2021
    },
    token: tokens.ltc,
    quoteToken: tokens.maki,
  },
  {
    pid: 29,
    lpSymbol: 'MAKI-MATIC',
    lpAddresses: {
      256: '',
      128: '0xeeb94653baeac54561a45b47ec2b107a31923722', // June 19th, 2021
    },
    token: tokens.matic,
    quoteToken: tokens.maki,
  },
  {
    pid: 21,
    lpSymbol: 'MAKI-AETH',
    lpAddresses: {
      256: '',
      128: '0x3af1b17956f87c00d534438e90bdbf7ce5ed2be1', // (June 11th, 2021)
    },
    token: tokens.aeth,
    quoteToken: tokens.maki,
  },
  {
    pid: 15,
    lpSymbol: 'MAKI-ETH',
    lpAddresses: {
      256: '',
      128: '0xEA5447Db71205FFb834fbEB33177D98C0AdD13ef', // (June 7th, 2021)
    },
    token: tokens.eth,
    quoteToken: tokens.maki,
  },
  {
    pid: 18,
    lpSymbol: 'MAKI-BTC',
    lpAddresses: {
      256: '',
      128: '0xF3F3CBeF5C90C78214929B61Fe7e5C00C1B37227', // (June 9th, 2021)
    },
    token: tokens.btc,
    quoteToken: tokens.maki,
  },
  {
    pid: 24,
    lpSymbol: 'MAKI-DOT',
    lpAddresses: {
      256: '', // 
      128: '0x4Ce51c76bBd6aD0aBdF13119e925c41512342c17', // June 14th, 2021
    },
    token: tokens.dot,
    quoteToken: tokens.maki
  },
  {
    pid: 3,
    lpSymbol: 'MAKI-HUSD',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad',
      128: '0x88b076F1C2EDcf558711a21639C15D01706938e8', // UPDATED
      // 128: '0xc189d2699c7e077cb050d9bc666effa40bb31771', // UPDATED
    },
    token: tokens.maki,
    quoteToken: tokens.husd,
  },
  {
    pid: 14,
    lpSymbol: 'MAKI-USDC',
    lpAddresses: {
      256: '',
      128: '0xFE963b6E4091fFF01DD10e1150A53Eb608848E75', // (June 7th, 2021)
    },
    token: tokens.usdc,
    quoteToken: tokens.maki
  },
  {
    pid: 16,
    lpSymbol: 'MAKI-USDT',
    lpAddresses: {
      256: '',
      128: '0x3eaf762adacb7fe967796a9c9d4c52d55761b42e', // (June 8th, 2021)
    },
    token: tokens.usdt,
    quoteToken: tokens.maki,
  },
  {
    pid: 31,
    lpSymbol: 'MAKI-O3',
    lpAddresses: {
      256: '', // 
      128: '0x329bae377d60df25E58a17b3d0B1D46Cf2F4fD8b', // June 30nd, 2021
    },
    token: tokens.o3,
    quoteToken: tokens.maki,
  },
  {
    pid: 22,
    lpSymbol: 'DOT-ETH',
    lpAddresses: {
      256: '', // UPDATE
      128: '0x3B8552476Af84fF8F7885d1E8918c1E85D9D10f4', // June 12th, 2021
    },
    token: tokens.dot,
    quoteToken: tokens.eth,
  },
  {
    pid: 4,
    lpSymbol: 'HUSD-HT',
    lpAddresses: {
      256: '',
      128: '0x12cb243CFa46f1cb98B0EAe80a1e2f757eDE2b3A',
    },
    token: tokens.husd,
    quoteToken: tokens.wht,
  },
  {
    pid: 5,
    lpSymbol: 'ETH-HUSD',
    lpAddresses: {
      256: '',
      128: '0xBdb405E580774F1AbA1273f22aF06c9B81433e87',
    },
    token: tokens.eth,
    quoteToken: tokens.husd,
  },
  {
    pid: 2,
    lpSymbol: 'LAYER-HT',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad',
      128: '0xc189d2699c7e077cb050d9bc666effa40bb31771',
    },
    token: tokens.layer,
    quoteToken: tokens.wht,
  },
  {
    pid: 6,
    lpSymbol: 'BTC-HUSD',
    lpAddresses: {
      256: '',
      128: '0x901a89e02cd610c04d0feb45791dbf64b8c20503',
    },
    token: tokens.btc,
    quoteToken: tokens.husd,
  },
  {
    pid: 28,
    lpSymbol: 'DOT-HT',
    lpAddresses: {
      256: '',
      128: '0x17448C40C3CABec4708CA6e6FbF212253195dE3b', // June 18th, 2021
    },
    token: tokens.dot,
    quoteToken: tokens.wht,
  },
  {
    pid: 27,
    lpSymbol: 'DAI-HT',
    lpAddresses: {
      256: '', 
      128: '0x927E800cF58B8b71710882248698C24268C73E10', // June 17th, 2021
    },
    token: tokens.dai,
    quoteToken: tokens.wht
  },
  {
    pid: 25,
    lpSymbol: 'BCH-HT',
    lpAddresses: {
      256: '', // UPDATE
      128: '0xA9d73cf74A1Bf493Cc64eDc45Cdbbbbfa276d580', // June 15th, 2021
    },
    token: tokens.bch,
    quoteToken: tokens.wht
  },
  {
    pid: 26,
    lpSymbol: 'ADA-HT',
    lpAddresses: {
      256: '',
      128: '0x32e9dF1057049AD672b01B4f7fdB54d922c38713', // (June 11th, 2021)
    },
    token: tokens.ada,
    quoteToken: tokens.wht,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-HT',
    lpAddresses: {
      256: '',
      128: '0x94c8C66670dE883c6667B8aa214c4961bFeeB04a', // (1/6/21)
    },
    token: tokens.usdt,
    quoteToken: tokens.wht,
  },
  {
    pid: 10,
    lpSymbol: 'ETH-HT',
    lpAddresses: {
      256: '',
      128: '0x65d024d140756677073aA3b7f7010a72b7117eFF', // (4/6/21)
    },
    token: tokens.eth,
    quoteToken: tokens.wht,
  },
  {
    pid: 11,
    lpSymbol: 'BTC-HT',
    lpAddresses: {
      256: '',
      128: '0xDEc79D81A873B13b31dFc6158ab175f573121732', // (June 5th, 2021)
    },
    token: tokens.btc,
    quoteToken: tokens.wht
  },
  {
    pid: 12,
    lpSymbol: 'AETH-HT',
    lpAddresses: {
      256: '',
      128: '0xE4c81115014787905CdF0D4216BfFE262A53bEBE', // (June 5th, 2021)
    },
    token: tokens.aeth,
    quoteToken: tokens.wht
  },
  {
    pid: 23,
    lpSymbol: 'FIL-HT',
    lpAddresses: {
      256: '', // 
      128: '0x69E47E80c2DFC6f30442757104d8Bd10eaeb9924', // June 13th, 2021
    },
    token: tokens.fil,
    quoteToken: tokens.wht
  },
  {
    pid: 9,
    lpSymbol: 'BTC-ETH',
    lpAddresses: {
      256: '',
      128: '0x82C12Ea7d9eD69E9CF631589A8911DD546615808', // (3/6/21)
    },
    token: tokens.btc,
    quoteToken: tokens.eth,
  },
  {
    pid: 17,
    lpSymbol: 'AAVE-HT',
    lpAddresses: {
      256: '',
      128: '0x6c9A6DDa61c0840F0fFbDee86501B8138eEb3f29', // (June 8th, 2021)
    },
    token: tokens.aave,
    quoteToken: tokens.wht
  },
  {
    pid: 19,
    lpSymbol: 'MATIC-HT',
    lpAddresses: {
      256: '',
      128: '0xcDbE5901b56d87Dfa9C0eAC815Ce3ddbB3e63714', // (June 9th, 2021)
    },
    token: tokens.matic,
    quoteToken: tokens.wht
  },
  {
    pid: 30,
    lpSymbol: 'MATIC-ETH',
    lpAddresses: {
      256: '',
      128: '0xa458bf4f266762ad087e7f9f60f94dd0661d76f4', // June 22nd, 2021
    },
    token: tokens.matic,
    quoteToken: tokens.eth,
  },
  {
    pid: 20,
    lpSymbol: 'LINK-HT',
    lpAddresses: {
      256: '',
      128: '0x8baaE305Bca59743F28761C2736D7160B0CDbd9a', // (June 10th, 2021)
    },
    token: tokens.link,
    quoteToken: tokens.wht
  },
  {
    pid: 8,
    lpSymbol: 'USDT-HUSD',
    lpAddresses: {
      256: '',
      128: '0x79DD12783DD8A1b33e6e530e77389B196962bBfa', // (2/6/21)
    },
    token: tokens.usdt,
    quoteToken: tokens.husd,
  },
  {
    pid: 13,
    lpSymbol: 'USDC-USDT',
    lpAddresses: {
      256: '',
      128: '0x1a5474f7b997181ed3431d76148376efd9bb7e0e', // (June 6th, 2021)
    },
    token: tokens.usdc,
    quoteToken: tokens.usdt
  },
  {
    pid: 36,
    lpSymbol: 'DOGE-USDT',
    lpAddresses: {
      256: '',
      128: '0xeD2aeC5C971F7260B4bF001593BF91C2feb370Cb',
    },
    token: tokens.doge,
    quoteToken: tokens.usdt
  },
  {
    pid: 37,
    lpSymbol: 'SHIB-MAKI',
    lpAddresses: {
      256: '',
      128: '0x4db7c033137c2843481a686cc0cb415ad09fa764',
    },
    token: tokens.shib,
    quoteToken: tokens.maki
  },
  {
    pid: 38,
    lpSymbol: 'MAKI-ACH',
    lpAddresses: {
      256: '',
      128: '0x5E9CdC40D1acF45fEf65313142e40C72059bcB98',
    },
    token: tokens.ach,
    quoteToken: tokens.maki
  },
  {
    pid: 39,
    lpSymbol: 'MAKI-TUSD',
    lpAddresses: {
      256: '',
      128: '0xBeBb035cD2AE625c3c670f71B96ec6B556D1a2Cf',
    },
    token: tokens.tusd,
    quoteToken: tokens.maki
  },
  {
    pid: 41,
    lpSymbol: 'PTD-HT',
    lpAddresses: {
      256: '',
      128: '0x3a51e981490f77bdf28f993bc88ba58bce780c16',
    },
    token: tokens.ptd,
    quoteToken: tokens.wht
  },
  {
    pid: 43,
    lpSymbol: 'TUSD-HUSD',
    lpAddresses: {
      256: '',
      128: '0xb5D65D8Af937ee8037Deb996BD57b96b37C60cf8'
    },
    token: tokens.tusd,
    quoteToken: tokens.husd
  },
  {
    pid: 44,
    lpSymbol: 'DAI-HUSD',
    lpAddresses: {
      256: '',
      128: '0x4A0246C791fAd59AD071de53CE591Cdf396A1560'
    },
    token: tokens.dai,
    quoteToken: tokens.husd
  }
]

export default farms
