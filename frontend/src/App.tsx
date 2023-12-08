
import { LoginModal } from './componenets/LoginModal';
import NavBar from './componenets/NavBar';
import SignUpModel from './componenets/SignUpModel';

import { useEffect, useState } from 'react';
import { User } from './models/user';
import * as UserApi from "./network/notes_api";
import { BrowserRouter, Routes , Route} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from "./styles/App.module.css"


function App() {
  
  const [loggedInUser , setLoggedInUser] = useState<User|null>(null)
  
  const [showSignUpModal , setShowSignUpModal] = useState(false)
  const [showLoginModal , setShowLoginModal] = useState(false)

  useEffect(() =>{
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser();
        console.log(user + "from App.tsx")
        setLoggedInUser(user)
        console.log(loggedInUser);
      } catch (error) {
        console.error(error)
      }
    }
    fetchLoggedInUser()
  }, [loggedInUser])


  
  return (
    <BrowserRouter>
    <div>
    <NavBar
    loggedInUser={loggedInUser}
    onLoginClicked={()=>setShowLoginModal(true)}
    onSignUpClicked={()=>setShowSignUpModal(true)}
    onLogoutSeccessful={()=>setLoggedInUser(null)}    
    />
    <Container className={styles.pageContainer}>
      <Routes>
        <Route
            path = "/"
            element= {<NotesPage loggedInUser={loggedInUser} />}
        />
        <Route
            path='/privacy'
            element = {<PrivacyPage/>}
        />
        <Route
            path='/*'
            element= {<NotFoundPage/>}
        />
      </Routes>
    </Container>
    
    
      
      {showSignUpModal &&  
      <SignUpModel
      onDismiss={()=>setShowSignUpModal(false)}
      onSignUpSuccessful={(user)=>{
        setLoggedInUser(user);
        setShowSignUpModal(false);
      }
      }
      
      
      />}
      {showLoginModal && 
      <LoginModal
      onDismiss={()=>setShowLoginModal(false)}
      onLoginSuccessful={(user)=>{
        setLoggedInUser(user);
        setShowLoginModal(false);   
      }}
      
      />}
    </div>
    </BrowserRouter>
      
    
  );
}

export default App;
