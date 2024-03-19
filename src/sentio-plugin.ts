import {
  CompilationJob,
  DependencyGraph,
  HardhatRuntimeEnvironment
} from 'hardhat/types'
import { SentioService } from './sentio/sentio-service'
import {
  TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
  TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
  TASK_COMPILE_SOLIDITY_GET_SOURCE_NAMES,
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS
} from 'hardhat/builtin-tasks/task-names'
import { UploadUserCompilationRequest } from './sentio/types'
import { readKey } from './sentio/key'
import { NETWORK_NAME_CHAIN_ID_MAP } from './constants'

export class SentioPlugin {
  private env: HardhatRuntimeEnvironment
  private sentioService: SentioService

  constructor(hre: HardhatRuntimeEnvironment) {
    console.log('initializing sentio plugin')
    this.env = hre
    const host = this.env.config.sentio?.host || 'https://app.sentio.xyz'
    const project = this.env.config.sentio?.project
    const apiKey = this.env.config.sentio?.apiKey || readKey(host)
    if (!apiKey) {
      console.log("missing api key, please login with sentio CLI first")
    }
    console.log('sentio config:', { host, project })

    this.sentioService = new SentioService(host, apiKey)
  }

  public async upload(args: {
    contractName: string,
    verify?: { address: string; chainID?: string },
    constructorArgs?: string
  }) {
    const { contractName, verify, constructorArgs } = args
    console.log('uploading', contractName)
    const job = await getCompilationJob(this.env, contractName)
    const source: { [path: string]: string } = {}
    for (const file of job.getResolvedFiles()) {
      source[file.sourceName] = file.content.rawContent
    }
    const req: UploadUserCompilationRequest = {
      projectOwner: undefined,
      projectSlug: undefined,
      compileSpec: {
        solidityVersion: job.getSolcConfig().version,
        contractName: contractName,
        multiFile: {
          compilerSettings: JSON.stringify(job.getSolcConfig().settings),
          source
        },
        constructorArgs
      }
    }
    if (this.env.config.sentio?.project) {
      const [owner, slug] = this.env.config.sentio.project.split('/')
      req.projectOwner = owner
      req.projectSlug = slug
    }
    if (verify) {
      let chainID = verify.chainID
      if (!chainID) {
        if (this.env.network?.config?.chainId !== undefined) {
          chainID = this.env.network.config.chainId.toString()
        } else {
          const network = this.env.hardhatArguments.network
          if (network === undefined) {
            console.error(`network not specified`)
            return
          }
          chainID = NETWORK_NAME_CHAIN_ID_MAP[network.toLowerCase()].toString()
          if (chainID == undefined) {
            console.error(`network ${network.toLowerCase()} not recognized`)
            return
          }
        }
      }
      req.verifySpec = {
        networkId: chainID,
        address: verify.address
      }
    }
    if (req.verifySpec) {
      console.log('verify', req.verifySpec)
    }
    const res = await this.sentioService.uploadUserCompilation(req)
    console.log('successfully uploaded contract', contractName, res)
    if (req.verifySpec) {
      if (res.verified) {
        console.log("successfully verified")
      } else {
        console.error("failed to verify the contract")
      }
    }
  }
}

async function getCompilationJob(
  hre: HardhatRuntimeEnvironment,
  contractName: string
): Promise<CompilationJob> {
  const dependencyGraph: DependencyGraph = await getDependencyGraph(hre)

  const artifact = hre.artifacts.readArtifactSync(contractName)
  const file = dependencyGraph.getResolvedFiles().find((resolvedFile) => {
    return resolvedFile.sourceName === artifact.sourceName
  })

  return hre.run(TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE, {
    dependencyGraph,
    file
  })
}

async function getDependencyGraph(
  hre: HardhatRuntimeEnvironment
): Promise<DependencyGraph> {
  const sourcePaths = await hre.run(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS)
  const sourceNames: string[] = await hre.run(
    TASK_COMPILE_SOLIDITY_GET_SOURCE_NAMES,
    {
      sourcePaths
    }
  )
  return hre.run(TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH, {
    sourceNames
  })
}
