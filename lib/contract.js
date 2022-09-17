import { ethers } from "ethers";
import Big  from 'big.js'
import contractABI from './Faucet.json'

let metamask

let address

const ADDRESS_CONTRACT = '0xA6aB333f78D356D7A898A66C4a5598C3afF2C985'

if (typeof window !== 'undefined') {
  metamask = window.ethereum
}

export const connectToWallet = async () => {
  if (!window.ethereum) throw Error('No Metamask')
  const addressArray = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })
  if (!addressArray.length) throw Error('Not connected')
  return addressArray[0]
}

export const checkConnected = async () => {
  if (!window.ethereum) throw Error('No Metamask')
  const addressArray = await window.ethereum.request({
    method: 'eth_accounts',
  })
  if (!addressArray.length) throw Error('Not connected')
  return addressArray[0]
}

export const signer = async () => {
  if (!metamask) return

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  return  provider.getSigner();
}

const contractFaucet = async () => {
  const sign = await signer()
  const transactionContract = new ethers.Contract(ADDRESS_CONTRACT, contractABI.abi, sign)
  return transactionContract
}

const fund = async () => {
  const contract = await contractFaucet()
}

export const initialize = async () => {
  const contract = await contractFaucet()
  const data = await contract.initialize('0x3f70d9eE6a9803D8bA2C471D0eCD5aeA303E668f', price(2), 1)
  const transactionParameters = {
    to: '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B',
    from: '0x3f70d9eE6a9803D8bA2C471D0eCD5aeA303E668f',
    data,
  }

  console.log(transactionParameters, 'transactionParameters')

  await metamask.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  })
}

export const price = (price) => {
  // console.log(ethers.utils.formatEther(1000000000000000000))
  const WEI = new Big(10).pow(18)

  const wei = new Big(price).times(WEI).toFixed(0)
  return wei
  // console.log(WEI)
  // console.log(ethers.utils.formatEther(wei))
}

export {
  address,
  metamask
}

// export default connectMetamask