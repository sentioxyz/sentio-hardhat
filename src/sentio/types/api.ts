export interface UploadUserCompilationRequest {
  projectOwner?: string | undefined
  projectSlug?: string | undefined
  compileSpec: SourceSpec
  verifySpec?: Verification | undefined
  name?: string | undefined
}

export interface UploadUserCompilationResponse {
  userCompilationId: string
  verified: boolean
}

export interface VerifyContractRequest {
  verifySpec: Verification | undefined
}

export interface VerifyContractResponse {
  verified: boolean
}

export interface Verification {
  id?: string
  networkId: string
  address: string
  userCompilationId?: string
  createTime?: Date | undefined
}

export interface SourceSpec {
  id?: string
  multiFile?: SourceMultiFile | undefined
  standardJson?: { [key: string]: any } | undefined
  metadata?: { [key: string]: any } | undefined
  solidityVersion: string
  contractName: string
  constructorArgs?: string
}

export interface SourceMultiFile {
  source: { [key: string]: string }
  compilerSettings: string
}
