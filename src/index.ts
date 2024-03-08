import { extendEnvironment } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { lazyObject } from 'hardhat/plugins'
import { SentioPlugin } from './sentio-plugin'
import './type-extensions'
import './tasks'

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.sentio = lazyObject(() => new SentioPlugin(hre))
})
