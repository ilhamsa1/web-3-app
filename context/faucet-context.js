import { useState, createContext,useContext, useEffect, Children  } from 'react'
import { ethers } from "ethers";
import { UserContext } from './user-context'
import { signer, metamask } from '../lib/contract'
import contractABI from '../lib/Faucet.json'

const ADDRESS_CONTRACT = '0xA6aB333f78D356D7A898A66C4a5598C3afF2C985'

export const FaucetContext = createContext({
  value: {}
})

const contractFaucet = async () => {
  const sign = await signer()
  const transactionContract = new ethers.Contract(ADDRESS_CONTRACT, contractABI.abi, sign)
  return transactionContract
}


const FaucetProvider = ({ children }) => {
  const { currentAccount } = useContext(UserContext)

  const getBalance = async () => {
    const contract = await contractFaucet()
    const data = await contract.balance()
    const balance = ethers.utils.formatEther(data)
    console.log(balance)
    return balance
  }

  const fund = async (address) => {
    const contract = await contractFaucet()
    const data = await contract.fund(address)
    console.log(data)

    // const transactionParameters = {
    //   to: ADDRESS_CONTRACT,
    //   from: currentAccount,
    //   data,
    // }

    // await metamask.request({
    //   method: 'eth_sendTransaction',
    //   params: [transactionParameters],
    // })

    return data
  }

  return (
    <FaucetContext.Provider
      value={{
        getBalance,
        fund,
      }}
    >
      {children}
    </FaucetContext.Provider>
  )
}

export default FaucetProvider
