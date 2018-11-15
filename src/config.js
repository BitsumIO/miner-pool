module.exports = {
  MINER_POOL_TYPES: {
    ANT_POOL: "ANT_POOL",
    F2_POOL: "F2_POOL",
    BW_POOL: "BW_POOL",
    MPH_POOL: "MPH_POOL"
  },
  MINER_POOL: {
    BW_POOL: {
    },
    MPH_POOL: {
      COIN_CURRENCY_MAP: {
        'ETH': 'ethereum',
        'ETC': 'Ethereum-classic',
        'XMR': 'monero',
        'ZCL': 'zclassic',
        'MAX': 'Maxcoin',
        'XZC': 'zcoin',
        'MONA': 'monacoin',
        'DASH': 'dash',
        'ZEN': 'zencash',
        'EXP': 'expanse',
        'MUSIC': 'Musicoin',
        'ESN': 'Ethersocial',
        'ETN': 'Electroneum',
        'ZEC': 'Zcash'
      }
    },
    ANT_POOL: {
      URL: 'https://antpool.com/api/',
      PAYMENT_TYPES: {
        PAYOUT: 'payout',
        PPS: 'pps',
        PPLNS: 'pplns',
        P2P: 'p2p'
      }
    },
    F2_POOL: {
      URL: 'http://api.f2pool.com/',
      COIN_CURRENCY_MAP: {
        BTC: 'bitcoin',
        LTC: 'litecoin',
        ETC: 'etc',
        ETH: 'eth',
        ZEC: 'zec',
        SC: 'sc',
        XMR: 'monero',
        Dash: 'dash',
        DCR: 'decred',
        XZC: 'zcoin',
        RVN: 'raven',
        XVG: 'verge-lyra',
        ETP: 'metaverse'
      }
    }
  }
}