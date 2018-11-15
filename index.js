const config = require('./src/config')
const F2MinerPool = require('./src/f2_miner_pool')
const AntMinerPool = require('./src/ant_miner_pool')
const BWMinerPool = require('./src/bw_miner_pool')
const MPHMinerPool = require('./src/mph_miner_pool')

module.exports = function createMinerPoolFactory (type, ...args) {
  switch (type) {
    case config.MINER_POOL_TYPES.ANT_POOL: {
      return AntMinerPool.create(...args)
    }
    case config.MINER_POOL_TYPES.F2_POOL: {
      return F2MinerPool.create(...args)
    }
    case config.MINER_POOL_TYPES.BW_POOL: {
      return BWMinerPool.create(...args)
    }
    case config.MINER_POOL_TYPES.MPH_POOL: {
      return MPHMinerPool.create(...args)
    }
    default: {
      throw new Error('Unknow Miner Pool Type: ', type)
    }
  }
}

module.exports.F2MinerPool = F2MinerPool
module.exports.AntMinerPool = AntMinerPool
module.exports.BWMinerPool = BWMinerPool
module.exports.config = require('./src/config')