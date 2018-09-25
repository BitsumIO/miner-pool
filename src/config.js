module.exports = {
  MINER_POOL_TYPES: {
    ANT_POOL: "ANT_POOL",
    F2_POOL: "F2_POOL",
    BW_POOL: "BW_POOL"
  },
  MINER_POOL: {
    BW_POOL: {
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
        ETC: 'eth',
        ETH: 'eth',
        ZEC: 'zec',
        SC: 'sc',
        XMR: 'monero',
        Dash: 'dash',
        DCR: 'decred',
        XZC: 'zcoin',
        RVN: 'raven'
      }
    }
  }
}