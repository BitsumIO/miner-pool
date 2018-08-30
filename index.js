const F2MinerPool = require('./src/f2_miner_pool')
const AntMinerPool = require('./src/ant_miner_pool')

module.exports = function createMinerPoolFactory (type, ...args) {
  switch (type) {
    case config.MINER_POOL_TYPES.ANT_POOL: {
      return AntMinerPool.create(...args)
    }
    case config.MINER_POOL_TYPES.F2_POOL: {
      return F2MinerPool.create(...args)
    }
    default: {
      throw new Error('Unknow Miner Pool Type: ', type)
    }
  }
}

module.exports.config = require('./src/config')