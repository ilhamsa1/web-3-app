import { useState, createContext, useEffect, Children  } from 'react'
import { checkConnected, connectToWallet } from '../lib/contract'


export const UserContext = createContext({
  value: {}
})

const UserProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [appStatus, setAppstatus] = useState('not-connected')

  useEffect(() => {
    const checkWalletConnect = async () => {
      try {
        const address = await checkConnected()
        console.log(address)
        setAppstatus('connected')
        setCurrentAccount(address)
      } catch(error) {
        setAppstatus('not-connected')
      }
    }

    checkWalletConnect()
  }, [])

  const connectWallet = async () => {
    try {
      const address = await connectToWallet()
      setAppstatus('connected')
      setCurrentAccount(address)
    } catch(error) {
      setAppstatus('not-connected')
    }
    // connectWallet
  }

  return (
    <UserContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider