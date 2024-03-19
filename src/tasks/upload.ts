import { task } from 'hardhat/config'
import { HardhatPluginError } from 'hardhat/plugins'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { PLUGIN_NAME } from '../constants'
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";

task('sentio:upload', 'upload contracts')
  .addPositionalParam(
    'contracts',
    'names of contracts that need to be uploaded'
  )
  .addOptionalParam('cargs', 'the map of constructor args, like Contract1=00000a')
  .setAction(uploadContracts)

async function uploadContracts(
  { contracts, cargs: constructorArgs }: any,
  hre: HardhatRuntimeEnvironment
) {
  if (!contracts) {
    throw new HardhatPluginError(PLUGIN_NAME, 'missing contracts')
  }
  await hre.run(TASK_COMPILE)
  const constructorArgsMap = Object.fromEntries(
    (constructorArgs || "").split(',').map((pair: string) => pair.split('='))
  )
  for (const name of (contracts as string).split(',')) {
    await hre.sentio.upload({
      contractName: name,
      constructorArgs: constructorArgsMap[name]
    })
  }
}
