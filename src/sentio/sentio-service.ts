import {
  UploadUserCompilationRequest,
  UploadUserCompilationResponse,
  VerifyContractRequest,
  VerifyContractResponse
} from './types'

export class SentioService {
  public host: string
  private readonly apiKey?: string

  constructor(host: string, apiKey?: string) {
    this.host = host
    this.apiKey = apiKey
  }

  public async uploadUserCompilation(
    req: UploadUserCompilationRequest
  ): Promise<UploadUserCompilationResponse> {
    const url = new URL('/api/v1/solidity/user_compilation', this.host)
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(req)
    })
    if (!res.ok) {
      throw new Error(
        `failed to upload user compilation: ${res.status} ${res.statusText}`
      )
    }
    return (await res.json()) as UploadUserCompilationResponse
  }

  public async verifyContract(
    req: VerifyContractRequest
  ): Promise<VerifyContractResponse> {
    const url = new URL('/api/v1/solidity/verification', this.host)
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(req)
    })
    if (!res.ok) {
      throw new Error(
        `failed to verify contract: ${res.status} ${res.statusText}`
      )
    }
    return (await res.json()) as VerifyContractResponse
  }

  private getHeaders(): { [k: string]: string } {
    const ret: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.apiKey) {
      ret['api-key'] = this.apiKey
    }
    return ret
  }
}
