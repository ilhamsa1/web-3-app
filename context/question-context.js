import { useState, createContext,useContext, useEffect, Children, useCallback  } from 'react'
import { ethers } from "ethers";
import { UserContext } from './user-context'
import { signer, metamask } from '../lib/contract'
import contractABI from '../lib/Question.json'

const ADDRESS_CONTRACT = '0xe5461e0762021d3a37aA7917AB321e991d309809'

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
  const [upvotes, setUpvotes] = useState([])
  const [downvotes, setDownvotes] = useState([])
  // const getBalance = async () => {
  //   const contract = await contract()
  //   const data = await contract.balance()
  //   // const balance = ethers.utils.formatEther(data)
  //   console.log(data)
  //   return balance
  // }
  useEffect(() => {
    const fetch = async () => {
      await fetchUpvotes()
      await fetchDownvotes()
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      await fetchQuestion()
    }
    fetch()
  }, [downvotes, upvotes])

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

  const fetchQuestion = useCallback(async () => {
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
        upvote: upvotes.filter((item) => item.questionId === quest[0].toNumber()).length,
        downvote: downvotes.filter((item) => item.questionId === quest[0].toNumber()).length,
      })
    }
    console.log(questionTemp)
    setQuestions(() => questionTemp)
    return questionTemp
  }, [upvotes, downvotes])

  const upVoteQuestion = async (questionId) => {
    const contract = await getContract()
    const data = await contract.upVoteQuestion(questionId, {
      value: ethers.utils.parseEther((1).toString()),
    })
    // console.log(config)
    return data
  }


  const downVoteQuestion = async (questionId) => {
    const contract = await getContract()
    const data = await contract.downnVoteQuestion(questionId, {
      value: ethers.utils.parseEther((3).toString()),
    })
    // console.log(config)
    return data
  }

   const fetchUpvotes = async () => {
    const contract = await getContract()
    const data = await contract.upVoteSize()

    const votesMap = data.map((item) => (
      {
        id: item.id.toNumber(),
        questionId: item.questionId.toNumber(),
        user: item.user,
      }
    ))
      console.log('upvotes', votesMap)
    setUpvotes(() => votesMap)
    return votesMap
  }

  const fetchDownvotes = async () => {
    const contract = await getContract()
    const data = await contract.downVoteSize()

    const votesMap = data.map((item) => (
      {
        id: item.id.toNumber(),
        questionId: item.questionId.toNumber(),
        user: item.user,
      }
    ))

    setDownvotes(() => votesMap)
    console.log('downvotes', votesMap)
    return votesMap
  }

  return (
    <QuestionContext.Provider
      value={{
        getConfig,
        askQuestion,
        questions,
        fetchQuestion,
        fetchUpvotes,
        fetchDownvotes,
        upVoteQuestion,
        downVoteQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}

export default QuestionProvider
