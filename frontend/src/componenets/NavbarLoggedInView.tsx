import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user"
import * as UserApi from "../network/notes_api"

interface NavbarLoggedInProps {
    user: User,
    onLogoutSuccessful: () => void
}

export const NavbarLoggedInView = ({user , onLogoutSuccessful}:NavbarLoggedInProps) => {
    
    async function logout() {
        try {
            await UserApi.logout();
            onLogoutSuccessful();

        } catch (error) {
            console.error(error)
            alert(error)
            
        }
     }

  return (
    <>
    <Navbar.Text className="me-2">
        Signed in as: {user.username} 
    </Navbar.Text>
    <Button onClick={logout}>Log out</Button>
    </>
    
  )
}
