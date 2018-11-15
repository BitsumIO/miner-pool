## MinerPool SDK Wrapper

### minerPool list

+ AntPool
+ F2Pool
+ MinerPoolHub
+ etc.

### Quick Start

+ install  
> npm install miner_pool --save

+ usage  
```javascript
const { config } = require('miner_pool')
const createMinerPoolFactory = require('miner_pool')
const minerPool = createMinerPoolFactory(config.MINER_POOL_TYPES.ANT_POOL, { key: 'foo', secret: 'bar', accountName: 'zzz'})
const stats = await minerPool.getAccountStats()

```

### API List

+ getPoolStats
+ getAccountStats
+ getPaymentHistory
+ getAccountHashrate
+ getAccountHashrateByType
+ getPaymentHistory
+ getWorkers
+ getWorkerHashrate
+ getWorkerHashrateByType
+ getAccountLast10MinutesHashrate
+ getWorkerLast10MinutesHashrate


## License MIT
