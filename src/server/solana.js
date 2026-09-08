import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import crypto from 'crypto'

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

const KNOWN_GENESIS_HASHES = {
  '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d': 'mainnet-beta',
  '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY': 'testnet',
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG: 'devnet',
}

let cachedConnection = null
let cachedConnectionUrl = null
let cachedKeypair = null
let cachedCluster = null

export function getRpcUrl() {
  return process.env.GETBLOCK_SOLANA_RPC_URL || null
}

export function getConnection() {
  const url = getRpcUrl()
  if (!url) return null
  if (!cachedConnection || cachedConnectionUrl !== url) {
    cachedConnection = new Connection(url, 'confirmed')
    cachedConnectionUrl = url
  }
  return cachedConnection
}

export async function getClusterName() {
  if (cachedCluster) return cachedCluster
  const connection = getConnection()
  if (!connection) return 'devnet'
  try {
    const genesisHash = await connection.getGenesisHash()
    cachedCluster = KNOWN_GENESIS_HASHES[genesisHash] || 'devnet'
    return cachedCluster
  } catch {
    return 'devnet'
  }
}

export function getKeypair() {
  if (cachedKeypair) return cachedKeypair

  const secret = process.env.SOLANA_SECRET_KEY
  if (!secret) return null

  try {
    const parsed = JSON.parse(secret)
    cachedKeypair = Keypair.fromSecretKey(Uint8Array.from(parsed))
    return cachedKeypair
  } catch {
    return null
  }
}

export function hashEntry({ entryType, value, timestamp }) {
  return crypto.createHash('sha256').update(`${entryType}:${value}:${timestamp}`).digest('hex')
}

export async function logHashToChain({ entryType, value, timestamp }) {
  const connection = getConnection()
  const keypair = getKeypair()

  if (!connection || !keypair) {
    return { signature: null, hash: null, cluster: null, error: 'Solana not configured' }
  }

  const hash = hashEntry({ entryType, value, timestamp })

  try {
    const instruction = new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(hash, 'utf-8'),
    })

    const transaction = new Transaction().add(instruction)
    transaction.feePayer = keypair.publicKey

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.sign(keypair)

    const signature = await connection.sendRawTransaction(transaction.serialize())
    const cluster = await getClusterName()
    return { signature, hash, cluster, error: null }
  } catch (err) {
    console.error('Solana log error:', err)
    return { signature: null, hash, cluster: null, error: err.message || 'Solana transaction failed' }
  }
}
