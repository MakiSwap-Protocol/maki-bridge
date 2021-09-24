const tokens = {
  wht: {
    symbol: 'HT',
    address: {
      256: '0x5b2da6f42ca09c77d577a12bead0446148830687',
      128: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
    },
    decimals: 18,
  },
  eth: {
    symbol: 'ETH',
    address: {
    256: '',
    128: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
    },
    decimals: 18,
  },
  btc: {
    symbol: 'BTC',
    address: {
      256: '',
      128: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
    },
    decimals: 18,
  },
  usdt: {
    symbol: 'USDT',
    address: {
      256: '',
      128: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
    },
    decimals: 18,
  },
  usdc: {
    symbol: 'USDC',
    address: {
      256: '',
      128: '0x9362bbef4b8313a8aa9f0c9808b80577aa26b73b',
    },
    decimals: 18,
  },
  husd: {
    symbol: 'HUSD',
    address: {
      256: '',
      128: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
    },
    decimals: 8,
  },
  soy: {
    symbol: 'SOY',
    address: {
      256: '0xEd2Fb478f7fCef33E1E1d980a0135789B295a7F5',
      128: '0xfb4C85B31b888e4F84aC131667865E029D6486F7',
    },
    decimals: 18,
    projectLink: 'https://makiswap.com/',
  },
  maki: {
    symbol: 'MAKI',
    address: {
      256: '0x6858a26bBBc8e185274969f6baf99674929Cf766',
      128: '0x5FaD6fBBA4BbA686bA9B8052Cf0bd51699f38B93',
    },
    decimals: 18,
    projectLink: 'https://makiswap.com/',
  },
  layer: {
    symbol: 'LAYER',
    address: {
      256: '',
      128: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    },
    decimals: 18,
    projectLink: 'https://unilayer.app/',
  },
  ada: {
    symbol: 'ADA',
    address: {
      256: '',
      128: '0x843af718ef25708765a8e0942f89edeae1d88df0',
    },
    decimals: 18,
  },
  aeth: {
    symbol: 'AETH',
    address: {
      256: '',
      128: '0x62c10412d69823a98db5c09cf6e82810e0df5ad7',
    },
    decimals: 18,
  },
  dot: {
    symbol: 'DOT',
    address: {
      256: '',
      128: '0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3',
    },
    decimals: 18,
  },
  matic: {
    symbol: 'MATIC',
    address: {
      256: '',
      128: '0xdb11743fe8b129b49b11236e8a715004bdabe7e5',
    },
    decimals: 18,
  },
  link: {
    symbol: 'LINK',
    address: {
      256: '',
      128: '0x9e004545c59d359f6b7bfb06a26390b087717b42',
    },
    decimals: 18,
  },
  bch: {
    symbol: 'BCH',
    address: {
      256: '',
      128: '0xef3cebd77e0c52cb6f60875d9306397b5caca375',
    },
    decimals: 18,
  },
  fil: {
    symbol: 'FIL',
    address: {
      256: '',
      128: '0xae3a768f9ab104c69a7cd6041fe16ffa235d1810',
    },
    decimals: 18,
  },
  aave: {
    symbol: 'AAVE',
    address: {
      256: '',
      128: '0x202b4936fe1a82a4965220860ae46d7d3939bb25',
    },
    decimals: 18,
  },
  dai: {
    symbol: 'DAI',
    address: {
      256: '',
      128: '0x3d760a45d0887dfd89a2f5385a236b29cb46ed2a',
    },
    decimals: 18,
  },
  ltc: {
    symbol: 'LTC',
    address: {
      256: '',
      128: '0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4',
    },
    decimals: 18,
  },
  o3: {
    symbol: 'O3',
    address: {
      256: '', // 
      128: '0xee9801669c6138e84bd50deb500827b776777d28', // June 30nd, 2021
    },
    decimals: 18,
  },
  doge: {
    symbol: 'DOGE',
    address: {
      256: '', // 
      128: '0x40280e26a572745b1152a54d1d44f365daa51618',
    },
    decimals: 8,
  },
  shib: {
    symbol: 'SHIB',
    address: {
      256: '', // 
      128: '0xdd86dd2dc0aca2a8f41a680fc1f88ec1b7fc9b09',
    },
    decimals: 18,
  },
  elk: {
    symbol: 'ELK',
    address: {
      256: '', // 
      128: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
    },
    decimals: 18,
  },
  ach: {
    symbol: 'ACH',
    address: {
      256: '', // 
      128: '0x4a31d1ad7430586752a1888fe947e3e7d52affb8',
    },
    decimals: 8,
  },
  tusd: {
    symbol: 'TUSD',
    address: {
      256: '', // 
      128: '0x5eE41aB6edd38cDfB9f6B4e6Cf7F75c87E170d98',
    },
    decimals: 18,
  },
  ptd: {
    symbol: 'PTD',
    address: {
      256: '',
      128: '0x52Ee54dd7a68e9cf131b0a57fd6015C74d7140E2'
    },
    decimal: 18
  }
  // ada: {
  //   symbol: 'ADA',
  //   address: {
  //     256: '',
  //     128: '',
  //   },
  //   decimals: 18,
  // },
  // ada: {
  //   symbol: 'ADA',
  //   address: {
  //     256: '',
  //     128: '',
  //   },
  //   decimals: 18,
  // },
  // ada: {
  //   symbol: 'ADA',
  //   address: {
  //     256: '',
  //     128: '',
  //   },
  //   decimals: 18,
  // },
}

export default tokens