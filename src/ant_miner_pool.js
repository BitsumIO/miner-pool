const crypto = require('crypto')
const config = require('./config')
const request = require('request-promise')
const moment = require('moment-timezone')

class AntMinerPool {
  constructor (options) {
    this.key = options.key
    this.secret = options.secret
    this.accountName = options.accountName
  }

  async makeRequest (options) {
    const result = await request.post(Object.assign({ json: true }, options))
    return result && result.data
  }

  makeSignature () {
    const nonce = Date.now()
    const message = this.accountName + this.key + nonce
    const hmac = crypto.createHmac('sha256', this.secret)
    const signature = hmac.update(message).digest('hex').toUpperCase()
    return { signature, nonce }
  }

  getPoolStats (coin) {
    const qs = Object.assign({ coin, key: this.key }, this.makeSignature())
    return this.makeRequest({ url: config.MINER_POOL.ANT_POOL.URL + 'poolStats.htm', qs })
  }

  getAccountStats (coin) {
    const qs = Object.assign({ coin, key: this.key }, this.makeSignature())
    return this.makeRequest({ url: config.MINER_POOL.ANT_POOL.URL + 'account.htm', qs })
  }

  normalizePaymentHistory (result) {
    if (!result || !result.rows || !result.rows.length) return []
    const data = result.rows.map(it => {
      return {
        txId: it.txId,
        amount: it.amount,
        timestamp: moment(it.timestamp).tz('Asia/Shanghai').toISOString()
      }
    })
    return sortBy(data, ['timestamp'])
  }

  async getPaymentHistory (coin) {
    const qs = Object.assign({}, { coin, key: this.key }, this.makeSignature())
    const data = await this.makeRequest({ url: config.MINER_POOL.ANT_POOL.URL + 'paymentHistory.htm', qs })
    return this.normalizePaymentHistory(data)
  }

  getAccountHashrate (coin) {
    const qs = Object.assign({ coin, key: this.key }, this.makeSignature())
    return this.makeRequest({ url: config.MINER_POOL.ANT_POOL.URL + 'hashrate.htm', qs })
  }

  async getAccountLast10MinutesHashrate(coinTag, coinAddress) {
    const result = await this.getAccountHashrate(coinTag, coinAddress)
    return { interval: 10, timestamp: moment().add(-10, 'minutes').toISOString(), value: result.last10m * 1000000 }
  }

  async getAccountHashrateByType (coin, type) {
    const stats = await this.getAccountHashrate(coin)
    return stats[type] || 0
  }

  getWorkers (coin, coinAddress, params = {}) {
    const qs = Object.assign({}, params, { coin, key: this.key }, this.makeSignature())
    return this.makeRequest({ url: config.MINER_POOL.ANT_POOL.URL + 'workers.htm', qs })
  }

  async getAllWorkers (coin, coinAddress) {
    const result = await this.getWorkers(coin, coinAddress, { pageEnable: 0 })
    return result.rows
  }

  async getWorkerHashrate (coin, workerName) {
    const workers = (await this.getWorkers(coin, { pageEnable: 0 })).rows
    return workers.find(it => it.worker === workerName)
  }

  async getWorkerLast10MinutesHashrate (coin, coinAddress, worker) {
    return { workerName: worker.worker, interval: 10, timestamp: moment().add(-10, 'minutes').toISOString(), value: worker.last10m * 1000000 }
  }

  async getWorkerHashrateByType (coin, workerName, type) {
    const stats = await this.getWorkerHashrate(coin, workerName)
    return stats ? stats[type] : 0
  }

  async getWorkerStatsByDay (coin, workerName) {
    const workerHashrate = await this.getWorkerHashrateByType(coin, workerName, 'last1d')
    const accountHashrate = await this.getAccountHashrateByType(coin, 'last1d')
    return { workerHashrate, accountHashrate }
  }

  async calcWorkerDailyWage (coin, workerName) {
    // const btcPrice = getBTCPrice()
    const { workerHashrate, accountHashrate } = await this.getWorkerStatsByDay(coin, workerName)
    const earn24 = (await this.getAccountStats(coin)).earn24Hours
    const amount = accountHashrate > 0 ? (earn24 * (workerHashrate/accountHashrate)) : 0
    // const money = amount * btcPrice * config.ACCOUNT_BONUS_RATIO
    return { amount, workerHashrate, accountHashrate }
  }
  
  static create (options) {
    options.accountName = options.accountName || options.name
    if (!AntMinerPool.instance[options.accountName]) {
      AntMinerPool.instance[options.accountName] = new AntMinerPool(options)
    }
    return AntMinerPool.instance[options.accountName]
  }
}

AntMinerPool.instance = {}

module.exports = AntMinerPool