import UserProvider from "./user-context";
import FaucetProvider from "./faucet-context";
import ProjectProvider from "./project-context";
import QuestionProvider from "./question-context";

const StoreProvider = ({ children }) => {
  return (
    <UserProvider>
      <FaucetProvider>
        <ProjectProvider>
          <QuestionProvider>
            {children}
          </QuestionProvider>
        </ProjectProvider>
      </FaucetProvider>
    </UserProvider>
  )
}

export default StoreProvider