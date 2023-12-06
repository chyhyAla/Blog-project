import styles from "../styles/Note.module.css"
import { Note as noteModel } from "../models/note";
import { Card } from "react-bootstrap";
import { formatDate } from "../utils/formatDate";
import {MdDelete } from 'react-icons/md'
import stylesUtils from '../styles/utils.module.css'

interface NoteProps {
    note : noteModel,
    onNoteClicked: (note: noteModel) => void,
    onDeleteNoteClicked: (note: noteModel) => void,
    className : string
}

const Note = ({note , onNoteClicked , onDeleteNoteClicked, className} : NoteProps) => {
    const {title , text , createdAt , updatedAt } = note
    
    let createdUpdatedDate: string;
    if(updatedAt>createdAt){
        createdUpdatedDate = "updated: " + formatDate(updatedAt)
    }else{
        createdUpdatedDate = "created: " + formatDate(createdAt)
    }
    return (
        <Card className={`${styles.noteCard} ${className}`}
        onClick={() => onNoteClicked(note)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={stylesUtils.flexCenter}>
                    {title}
                    <MdDelete 
                    className="text-muted ms-auto"
                    onClick={(e) =>{
                        onDeleteNoteClicked(note);
                        e.stopPropagation()
                    

                    }}
                    />
                    
                </Card.Title>
                <Card.Text className={styles.noteText}>
                    {text}
                    
                </Card.Text>
                
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedDate}
            </Card.Footer>

        </Card>

    )
    
}

export default Note;