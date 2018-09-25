const request = require('request-promise')

class BWMinerPool {
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
    const hmac = crypto.createHmac('md5', this.secret)
    const signature = hmac.update(message).digest('hex').toUpperCase()
    return { signature, nonce }
  }

  normalizeUrl (action, coin) {
    return `https://${coin}.bwpool.net/api/${action}`
  }

  getAccountStats (coin) {
    const qs = Object.assign({ key: this.key, userName: this.accountName }, this.makeSignature())
    return this.makeRequest({ url: this.normalizeUrl('account', coin), qs })
  }

  getAccountHashrate (coin) {
    const qs = Object.assign({ key: this.key, userName: this.accountName }, this.makeSignature())
    return this.makeRequest({ url: this.normalizeUrl('hashrate', coin), qs })
  }

  getAccountHashrateByType (coin, type) {
    //FIXME
  }

  getWorkers (coin, params = {}) {
    const qs = Object.assign({ key: this.key, userName: this.accountName }, this.makeSignature())
    return this.makeRequest({ url: this.normalizeUrl('workers', coin), qs })
  }

  async getWorkerHashrate (coin, workerName) {
    const result = await this.getWorkers(coin, { worker: workerName })
    return (result && result.workers && result.workers.length === 1) ?
      result.workers[0].hashrate : 0
  }

  getWorkerHashrateByType (coin, workerName, type) {
    //BW矿池不支持按照类型查询过去的算力
    return this.getWorkerHashrate(coin, workerName)
  }

  getWorkerStatsByDay (coin, workerName) {
    //FIXME
  }

  calcWorkerDailyWage (coin, workerName) {
    //FIXME
  }

  static create (options) {
    if (!BWMinerPool.instance[options.accountName]) {
      BWMinerPool.instance[options.accountName] = new BWMinerPool(options)
    }
    return BWMinerPool.instance[options.accountName]
  }
}

BWMinerPool.instance = {}

module.exports = BWMinerPool