const util = require('util')
const config = require('./config')
const MiningPoolHub = require('miningpoolhub')

class MPHMinerPool {
  constructor (options) {
    this.key = options.key
    this.userId = options.accountName
  }

  getCoinTag (coinName) {
    const coinTags = Object.keys(config.MINER_POOL.MPH_POOL.COIN_CURRENCY_MAP)
    for (const tag of coinTags) {
      const value = config.MINER_POOL.MPH_POOL.COIN_CURRENCY_MAP[tag]
      if (value.toLowerCase() === coinName.toLowerCase()) {
        return tag
      }
    }
  }

  getMPHInstance (coinTag) {
    const instance =  new MiningPoolHub({ api_key: this.key })
    if (coinTag) {
      instance.setCoin(config.MINER_POOL.MPH_POOL.COIN_CURRENCY_MAP[coinTag])
    }
    return instance
  }

  async getMiningAndProfitStatis () {
    const instance = this.getMPHInstance()
    const result = await util.promisify(instance.getminingandprofitsstatistics.bind(instance))()
    return result.map(it => {
      it.tag = this.getCoinTag(it.coin_name)
      return it
    })
    .filter(it => it.tag)
  }

  async getUserBalance (coinTag) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserbalance.bind(instance))(this.userId)
    return result.getuserbalance.data
  }

  async getPaymentHistory (coinTag, coinAddress, ctx) {
    const balance = await this.getUserBalance(coinTag)
    if (!(Array.isArray(ctx) && ctx.length)) {
      return [{ balance, amount: 0, timestamp: new Date().toISOString() }]
    }
    const amount = balance.confirmed - ctx[0].balance.confirmed
    if (amount > 0) {
      ctx.push({ balance, amount, timestamp: new Date().toISOString() })
    }
    return ctx
  }
  
  normalizeWorkers (list) {
    return list.map(it => it.username.split('.')[1]).filter(it => !!it)
  }

  async getAllWorkers (coinTag) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers.bind(instance))(this.userId)
    return this.normalizeWorkers(result.getuserworkers.data)
  }

  async getWorkerLast10MinutesHashrate (coinTag, coinAddress, worker) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers.bind(instance))(this.userId)
    const workerStatis = result.getuserworkers.data.find(it => it.username.split('.')[1] === worker)
    return { workerName: worker, interval: 10, timestamp: new Date().toISOString(), value: workerStatis.hashrate }
  }

  async getAccountLast10MinutesHashrate(coinTag, coinAddress) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers.bind(instance))(this.userId)
    const accountHashrate = result.getuserworkers.data.reduce((acc, it) => {
      return acc + it.hashrate
    }, 0)
    return { interval: 10, timestamp: new Date().toISOString(), interval: 10, value: accountHashrate }
  }

  static create (options) {
    options.accountName = options.accountName || options.name
    if (!MPHMinerPool.instance[options.accountName]) {
      MPHMinerPool.instance[options.accountName] = new MPHMinerPool(options)
    }
    return MPHMinerPool.instance[options.accountName]
  }
}

MPHMinerPool.instance = {}

module.exports = MPHMinerPool