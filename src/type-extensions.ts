import 'hardhat/types/config'
import 'hardhat/types/runtime'

import { SentioPlugin } from './sentio-plugin'
import { SentioConfig } from './sentio/types'

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    sentio: SentioPlugin
  }
}

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    sentio?: SentioConfig
  }

  export interface HardhatConfig {
    sentio: SentioConfig
  }
}
