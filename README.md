## MinerPool SDK Wrapper

### minerPool list

+ AntPool
+ F2Pool
+ etc.

### Quick Start

+ install  
> npm install miner_pool --save

+ usage  
```javascript
const { config } = require('miner_pool')
const createMinerPoolFactory = require('miner_pool')
const minerPool = createMinerPoolFactory(config.MINER_POOL_TYPES.ANT_POOL, { key: 'foo', secret: 'bar', accountName: 'zzz'})
const const stats = await minerPool.getAccountStats()

```

### API List

+ calcWorkerDailyWage
+ getPoolStats
+ getAccountStats
+ getPaymentHistory
+ getAccountHashrate
+ getAccountHashrateByType
+ getWorkers
+ getWorkerHashrate
+ getWorkerHashrateByType
+ getWorkerStatsByDay


## License MIT