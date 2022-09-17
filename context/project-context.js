import { useState, createContext,useContext, useEffect, Children  } from 'react'
import { ethers } from "ethers";
import { UserContext } from './user-context'
import { signer, metamask } from '../lib/contract'
import contractABI from '../lib/Project.json'

const ADDRESS_CONTRACT = '0xb05e7D80b7D65e6d1f60b9564D59569AEb118F80'

export const ProjectContext = createContext({
  value: {}
})

const contractProject = async () => {
  const sign = await signer()
  const transactionContract = new ethers.Contract(ADDRESS_CONTRACT, contractABI.abi, sign)
  console.log(transactionContract)
  return transactionContract
}


const ProjectProvider = ({ children }) => {
  const { currentAccount } = useContext(UserContext)

  const getBalance = async () => {
    const contract = await contractProject()
    const data = await contract.balance()
    // const balance = ethers.utils.formatEther(data)
    console.log(data)
    return balance
  }

  const getConfig = async () => {
    const contract = await contractProject()
    const data = await contract.config()
    const config = ethers.utils.formatEther(data)
    console.log(config)
    return config
  }

  const submitProject = async (name) => {
    const contract = await contractProject()
    const data = await contract.submitProject(name, {
      value: ethers.utils.parseEther((3).toString()),
    })

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
    <ProjectContext.Provider
      value={{
        getBalance,
        getConfig,
        submitProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
