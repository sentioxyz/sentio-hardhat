import path from 'path'
import fs from 'fs'
import os from 'os'

const homeDir = os.homedir()
const sentioDir = path.join(homeDir, '.sentio')

export function readKey(host: string): string | undefined {
  if (!fs.existsSync(sentioDir)) {
    return undefined
  }
  const configFile = path.join(sentioDir, 'config.json')
  if (fs.existsSync(configFile)) {
    const content = fs.readFileSync(configFile, 'utf8')
    const config = JSON.parse(content)
    return config[host]?.api_keys
  } else {
    return undefined
  }
}
