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
  .setAction(uploadContracts)

async function uploadContracts(
  { contracts }: any,
  hre: HardhatRuntimeEnvironment
) {
  if (!contracts) {
    throw new HardhatPluginError(PLUGIN_NAME, 'missing contracts')
  }
  await hre.run(TASK_COMPILE)
  for (const name of (contracts as string).split(',')) {
    await hre.sentio.upload(name)
  }
}
