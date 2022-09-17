import { useState, createContext,useContext, useEffect, Children  } from 'react'
import { ethers } from "ethers";
import { UserContext } from './user-context'
import { signer, metamask } from '../lib/contract'
import contractABI from '../lib/Question.json'

const ADDRESS_CONTRACT = '0x5BA89411321CF13A461cfdBd713bA7478915fdcF'

export const QuestionContext = createContext({
  value: {}
})

const getContract = async () => {
  const sign = await signer()
  const transactionContract = new ethers.Contract(ADDRESS_CONTRACT, contractABI.abi, sign)
  console.log(transactionContract)
  return transactionContract
}

const QuestionProvider = ({ children }) => {
  const { currentAccount } = useContext(UserContext)
  const [questionSize, setQuestionSize] = useState(0)
  const [questions, setQuestions] = useState([])
  // const getBalance = async () => {
  //   const contract = await contract()
  //   const data = await contract.balance()
  //   // const balance = ethers.utils.formatEther(data)
  //   console.log(data)
  //   return balance
  // }
  useEffect(() => {
    fetchQuestion()
  }, [])

  const getConfig = async () => {
    const contract = await getContract()
    const data = await contract.config()
    console.log(data)
    // console.log(config)
    return data
  }

  const askQuestion = async (question) => {
    const contract = await getContract()
    const data = await contract.askQuestion(question, {
      value: ethers.utils.parseEther((10).toString()),
    })
    // console.log(config)
    return data
  }

  const fetchQuestion = async () => {
    const contract = await getContract()
    const questionSize = await contract.questionSize()
    console.log(questionSize.toNumber())
    const questionTemp = []
    for(let i = 0; i < questionSize.toNumber(); i++) {
      const quest = await contract.questions(i)
      questionTemp.push({
        id: quest[0].toNumber(),
        asked: quest[1],
        question: quest[2],
        isDone: quest[3],
      })
    }
    setQuestions(() => questionTemp)
    return questionTemp
  }

  const upVoteQuestion = async () => {
    const contract = await getContract()
    const data = await contract.upVoteQuestion(question, {
      value: ethers.utils.parseEther((1).toString()),
    })
    // console.log(config)
    return data
  }

  const downVoteQuestion = async () => {
    const contract = await getContract()
    const data = await contract.downnVoteQuestion(question, {
      value: ethers.utils.parseEther((3).toString()),
    })
    // console.log(config)
    return data
  }

  return (
    <QuestionContext.Provider
      value={{
        getConfig,
        askQuestion,
        questions,
        fetchQuestion,
        upVoteQuestion,
        downVoteQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}

export default QuestionProvider
