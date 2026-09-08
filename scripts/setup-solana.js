import { Connection, Keypair } from '@solana/web3.js'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  const envPath = join(__dirname, '..', '.env.local')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '')
    }
  }
}

loadEnvLocal()

const rpcUrl = process.env.GETBLOCK_SOLANA_RPC_URL

if (!rpcUrl) {
  console.error('Missing GETBLOCK_SOLANA_RPC_URL in .env.local — add it first, then re-run this script.')
  process.exit(1)
}

const connection = new Connection(rpcUrl, 'confirmed')

const KNOWN_GENESIS_HASHES = {
  '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d': 'mainnet-beta',
  '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY': 'testnet',
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG: 'devnet',
}

async function main() {
  console.log('Testing RPC connection to GetBlock endpoint...')
  const { blockhash } = await connection.getLatestBlockhash()
  console.log('Connected. Latest blockhash:', blockhash)

  const genesisHash = await connection.getGenesisHash()
  const cluster = KNOWN_GENESIS_HASHES[genesisHash] || 'unknown'
  console.log(`This endpoint is actually on: ${cluster}`)

  let keypair
  if (process.env.SOLANA_SECRET_KEY) {
    console.log('\nSOLANA_SECRET_KEY already set in .env.local — using the existing keypair.')
    keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLANA_SECRET_KEY)))
  } else {
    keypair = Keypair.generate()
    console.log('\nNo SOLANA_SECRET_KEY found — generated a new keypair.')
    console.log('Add this line to .env.local, then re-run this script:\n')
    console.log(`SOLANA_SECRET_KEY=${JSON.stringify(Array.from(keypair.secretKey))}`)
    console.log('\nPublic key (address):', keypair.publicKey.toBase58())
    return
  }

  console.log('Public key (address):', keypair.publicKey.toBase58())

  const balance = await connection.getBalance(keypair.publicKey)
  console.log('Current balance:', balance / 1e9, 'SOL')

  if (balance > 0) {
    console.log('\nAlready funded — nothing more to do.')
    return
  }

  console.log(`\nRequesting ${cluster} airdrop of 1 SOL...`)
  try {
    const sig = await connection.requestAirdrop(keypair.publicKey, 1e9)
    await connection.confirmTransaction(sig, 'confirmed')
    const newBalance = await connection.getBalance(keypair.publicKey)
    console.log('Airdrop successful. New balance:', newBalance / 1e9, 'SOL')
  } catch (err) {
    console.error('\nAirdrop via this RPC failed (many providers rate-limit or block faucet requests):')
    console.error(err.message)
    console.log(`\nFund it manually instead at https://faucet.solana.com (select "${cluster}") using this address:`)
    console.log(keypair.publicKey.toBase58())
  }
}

main().catch((err) => {
  console.error('Setup failed:', err.message || err)
  process.exit(1)
})
