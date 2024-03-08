import { task } from 'hardhat/config'
import { HardhatPluginError } from 'hardhat/plugins'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { PLUGIN_NAME } from '../constants'

task('sentio:verify', 'upload contract and verify')
  .addParam(
    'contract',
    'name of the contract that need to be uploaded and verified'
  )
  .addParam('address', 'on-chain address')
  .addOptionalParam('chain', 'chain ID')
  .setAction(verifyContract)

async function verifyContract(
  { contract, address, chain }: any,
  hre: HardhatRuntimeEnvironment
) {
  if (!contract) {
    throw new HardhatPluginError(PLUGIN_NAME, 'missing contract name')
  }
  if (!address) {
    throw new HardhatPluginError(PLUGIN_NAME, 'missing address')
  }
  await hre.sentio.upload(contract, { address, chainID: chain })
}
