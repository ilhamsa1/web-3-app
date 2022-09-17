import { create as ipfsHttpClient } from 'ipfs-http-client'


const INFURA_IPFS_PROJECT_ID='2Dvt5oiuZqbdvOKkc6ImMZYLc8V'
const INFURA_IPFS_PROJECT_SECRET='17826ffdd10347544a9cd2bef38ad59f'

const projectId = INFURA_IPFS_PROJECT_ID
const projectSecret = INFURA_IPFS_PROJECT_SECRET
const projectIdAndSecret = `${projectId}:${projectSecret}`
const auth = `Basic ${Buffer.from(projectIdAndSecret).toString('base64')}`

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})


export default client