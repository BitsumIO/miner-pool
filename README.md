## MinerPool sdk wrapper

### minerPool list

+ AntPool
+ F2Pool
+ etc.

### Quick Start

```javascript
const { config } = require('miner-pool')
const createMinerPoolFactory = require('miner-pool')
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