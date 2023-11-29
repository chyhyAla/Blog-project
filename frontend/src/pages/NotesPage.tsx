import { Container } from 'react-bootstrap'
import NotesPageLoggedInView from "../componenets/NotesPageLoggedinView";
import NotesPageLoggedOutView from "../componenets/NotesPageLoggedOutView"
import { User } from "../models/user";
import styles from "../styles/Note.module.css";

interface NotesPageProps {
    loggedInUser: User | null,
}
const NotesPage = ({loggedInUser}: NotesPageProps) => {
    
  return (
        <Container className={styles.notesPage}>
            <>
                {loggedInUser
                    ? <NotesPageLoggedInView />
                    : <NotesPageLoggedOutView />
                }
            </>
        </Container>
  )
}

export default NotesPage