import { Button } from "react-bootstrap"

interface NavbarLoggedOutViewProps{
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavbarLogoutView = ({onSignUpClicked , onLoginClicked}: NavbarLoggedOutViewProps) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Log In</Button>
    </>
  )
}

export default NavbarLogoutView