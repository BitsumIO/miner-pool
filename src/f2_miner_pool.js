const config = require('./config')
const request = require('request-promise')
const moment = require('moment-timezone')
const sortBy = require('lodash.sortby')

class F2MinerPool {
  constructor (options) {
    this.key = options.key
    this.secret = options.secret
    this.accountName = options.accountName
  }

  async makeRequest (coinTag, coinAddress, workerName = '') {
    const coinName = config.MINER_POOL.F2_POOL.COIN_CURRENCY_MAP[coinTag]
    const url = `${config.MINER_POOL.F2_POOL.URL}${coinName}/${coinAddress}` + (workerName ? ('/' + workerName) : '')
    const result = await request.get({ url, json: true })
    return result
  }

  //请求单个用户数据
  async getAccountStats (coinTag, coinAddress) {
    const result = await this.makeRequest(coinTag, coinAddress)
    return result
  }

  normalizePaymentHistory (result) {
    if (!result || !result.payout_history) return []
    const data = result.payout_history
      .map(it => {
        return {
          txId: it[1],
          amount: it[2],
          timestamp: moment(it[0]).toISOString()
        }
      })
      .filter(it => !!it.txId)
    return sortBy(data, ['timestamp'])
  }

  //支付历史记录
  async getPaymentHistory (coinTag, coinAddress) {
    const result = await this.makeRequest(coinTag, coinAddress)
    return this.normalizePaymentHistory(result)
  }

  //请求单个用户过去24小时算力数据
  async getAccountHashrate(coinTag, coinAddress) {
    const stats = await this.getAccountStats(coinTag, coinAddress)
    return stats.hashes_last_day
  }

  async getWorkers (coinTag, coinAddress, params = {}) {
    const stats = await this.getAccountStats(coinTag, coinAddress)
    return stats.workers.map(it => it[0]).filter(it => !!it && it.length)
  }

  getAllWorkers (coin, coinAddress) {
    return this.getWorkers(coin, coinAddress)
  }

  //请求矿机过去24小时算力数据
  async getWorkerHashrate (coinTag, coinAddress, workerName) {
    const stats = await this.makeRequest(coinTag, coinAddress, workerName)
    return Object.values(stats.hashrate_history).reduce((acc, cur) => {
      return acc += cur
    }, 0)
  }

  async getWorkerLast10MinutesHashrate (coinTag, coinAddress, worker) {
    const stats = await this.makeRequest(coinTag, coinAddress, worker)
    const keys = Object.keys(stats.hashrate_history).sort()
    const key = keys[keys.length - 1]
    return { workerName: worker, interval: 10, timestamp: key, value: stats.hashrate_history[key] }
  }

  //请求单个用户过去10分钟算力数据
  async getAccountLast10MinutesHashrate(coinTag, coinAddress) {
    const stats = await this.getAccountStats(coinTag, coinAddress)
    if (stats) {
      const keys = Object.keys(stats.hashrate_history).sort()
      const key = keys[keys.length - 1]
      return { interval: 10, timestamp: key, value: stats.hashrate_history[key] }
    }
  }

  async getWorkerStatsByDay (coinTag, coinAddress, workerName) {
    const workerHashrate = await this.getWorkerHashrate(coinTag, coinAddress, workerName)
    const accountHashrate = (await this.getAccountStats(coinTag, coinAddress)).hashes_last_day
    return { workerHashrate, accountHashrate }
  }

  async calcWorkerDailyWage (coinTag, coinAddress, workerName) {
    // const btcPrice = getBTCPrice()
    const { workerHashrate, accountHashrate } = await this.getWorkerStatsByDay(coinTag, coinAddress, workerName)
    const earn24 = (await this.getAccountStats(coinTag, coinAddress)).value_last_day
    const amount = accountHashrate > 0 ? (earn24 * (workerHashrate/accountHashrate)) : 0
    // const money = amount * btcPrice * config.ACCOUNT_BONUS_RATIO
    return { workerHashrate, accountHashrate, amount }
  }
  
  static create (options) {
    options.accountName = options.accountName || options.name
    if (!F2MinerPool.instance[options.accountName]) {
      F2MinerPool.instance[options.accountName] = new F2MinerPool(options)
    }
    return F2MinerPool.instance[options.accountName]
  }
}

F2MinerPool.instance = {}

module.exports = F2MinerPool