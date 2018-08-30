const config = require('./config')
const request = require('request-promise')

class F2MinerPool {
  constructor (options) {
    this.key = options.key
    this.secret = options.secret
    this.accountName = options.accountName
  }

  async makeRequest (coin, workerName = '') {
    const coinName = config.MINER_POOL.F2_POOL.COIN_CURRENCY_MAP[coin]
    const url = `${config.MINER_POOL.F2_POOL.URL}${coinName}/${this.accountName}` + (workerName ? ('/' + workerName) : '')
    const result = await request.get({ url, json: true })
    return result
  }

  //请求矿机过去24小时算力数据
  async getWorkerHashrate (coin, workerName) {
    const stats = await this.makeRequest(coin, workerName)
    return Object.values(stats.hashrate_history).reduce((acc, cur) => {
      return acc += cur
    }, 0)
  }

  //请求单个用户数据
  async getAccountStats (coin) {
    const result = await this.makeRequest(coin)
    return result
  }

  //请求单个用户过去24小时算力数据
  async getAccountHashrate(coin) {
    const stats = await this.getAccountStats(coin)
    return stats.hashes_last_day
  }

  async getWorkerStatsByDay (coin, workerName) {
    const workerHashrate = await this.getWorkerHashrate(coin, workerName)
    const accountHashrate = (await this.getAccountStats(coin)).hashes_last_day
    return { workerHashrate, accountHashrate }
  }

  async calcWorkerDailyWage (coin, workerName) {
    // const btcPrice = getBTCPrice()
    const { workerHashrate, accountHashrate } = await this.getWorkerStatsByDay(coin, workerName)
    const earn24 = (await this.getAccountStats(coin)).value_last_day
    const amount = accountHashrate > 0 ? (earn24 * (workerHashrate/accountHashrate)) : 0
    // const money = amount * btcPrice * config.ACCOUNT_BONUS_RATIO
    return { workerHashrate, accountHashrate, amount }
  }
  
  static create (options) {
    if (!F2MinerPool.instance[options.accountName]) {
      F2MinerPool.instance[options.accountName] = new F2MinerPool(options)
    }
    return F2MinerPool.instance[options.accountName]
  }
}

F2MinerPool.instance = {}

module.exports = F2MinerPool