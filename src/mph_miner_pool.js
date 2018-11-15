const util = require('util')
const config = require('./config')
const MiningPoolHub = require('miningpoolhub')

class MPHMinerPool {
  constructor (options) {
    this.key = options.key
    this.userId = options.accountName
  }

  getMPHInstance (coinTag) {
    const instance =  new MiningPoolHub({ api_key: this.key })
    instance.setCoin(config.MINER_POOL.MPH_POOL.COIN_CURRENCY_MAP[coinTag])
    return instance
  }

  async getUserBalance (coinTag) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserbalance)(this.userId)
    return result.data
  }

  async getPaymentHistory (coinTag, coinAddress, ctx) {
    const balance = await this.getUserBalance(coinTag)
    if (!(Array.isArray(ctx) && ctx.length)) {
      return [{ balance, amount: 0, timestamp: new Date().toISOString() }]
    }
    const amount = balance.confirmed - ctx[0].balance.confirmed
    if (amount > 0) {
      ctx.unshift({ balance, amount, timestamp: new Date().toISOString() })
    }
    return ctx
  }
  
  normalizeWorkers (list) {
    return (list.data || []).map(it => it.username && it.username.split('.') > 1 && it.username.split('.')[1]).filter(it => !!it)
  }

  async getAllWorkers (coinTag) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers)(this.userId)
    return this.normalizeWorkers(result)
  }

  async getWorkerLast10MinutesHashrate (coinTag, coinAddress, worker) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers)(this.userId)
    const workerStatis = result.data.find(it => it.username === worker)
    return { workerName: workerStatis.username, interval: 10, timestamp: new Date().toISOString(), value: workerStatis.hashrate }
  }

  async getAccountLast10MinutesHashrate(coinTag, coinAddress) {
    const instance = this.getMPHInstance(coinTag)
    const result = await util.promisify(instance.getuserworkers)(this.userId)
    const accountHashrate = result.data.reduce((acc, it) => {
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