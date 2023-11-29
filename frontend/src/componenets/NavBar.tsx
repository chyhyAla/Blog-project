import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user"
import { NavbarLoggedInView } from "./NavbarLoggedInView";
import NavbarLogoutView from "./NavbarLogoutView";
import {Link} from "react-router-dom"

interface NavBarProps {
    loggedInUser: User | null;
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSeccessful: () => void,

}

const NavBar = ({loggedInUser , onSignUpClicked , onLoginClicked , onLogoutSeccessful}: NavBarProps) => {
  return (
    <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
        <Container>
            <Navbar.Brand as={Link} to="/">
                Cool Notes App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar"/>
            <Navbar.Collapse id="main-navbar">
                <Nav>
                    <Nav.Link as={Link} to="/privacy">
                        Privacy
                    </Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    { loggedInUser ?
                    <NavbarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSeccessful}/>: 
                    <NavbarLogoutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked}/>

                    }
                </Nav>
            </Navbar.Collapse>

        </Container>
    </Navbar>
  )
}

export default NavBar