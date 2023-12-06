
import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { Note as noteModel } from '../models/note';
import * as notesApi from '../network/notes_api1';
import AddEditnoteForm from "./AddEditnoteForm";
import Note from "./note";
import styles from '../styles/Note.module.css';
import styleUtils from '../styles/utils.module.css';



const NotesPageLoggedinView = () => {
    const [notes , setNotes] = useState<noteModel[]> ([])
  const [notesLoading , setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);


  const [ShowAddNote , setShowAddNote] = useState(false)

  const [noteToEdit , setNoteToEdit] = useState<noteModel|null>(null);
  useEffect(() => {
    async function fetchNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
       const notes = await notesApi.fetchNotes() 
      setNotes(notes);
    } catch (error) {
      console.log(error)
      setNotesLoading(false)
    }finally{
      setNotesLoading(false)
    }
      
    } 
    fetchNotes()
    
  },[])
  async function deleteNote(note : noteModel) {
    try {
      await notesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id))
    } catch (error) {
      console.error(error)
      alert(error)
    }
    
  }
 
   const notesGrid = 
  <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {notes.map(note => (
        <Col key={note._id}  >
        <Note note={note} className={styles.note}
        onNoteClicked={(note)=>setNoteToEdit(note)}
        onDeleteNoteClicked={deleteNote}
        
        />
        </Col> 
      ))}
      </Row>
    
  return (
    <>
     <Button 
      className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      onClick={() => setShowAddNote(true)}>
        <FaPlus/>
        Add new Note
      </Button>
      {notesLoading && <Spinner animation='border' variant='primary' />}   
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}  
      {!notesLoading && !showNotesLoadingError && 
      <>
      {
        notes.length > 0 ? notesGrid : <p> You don't any notes yet   </p>
      }
      
      
      </>
      
      }
      {ShowAddNote && 
        <AddEditnoteForm  closeButton={() => setShowAddNote(false)}
        onNoteSaved={(newNote) => {
          setNotes([...notes , newNote])
          setShowAddNote(false)
        }}/>

      }
      {noteToEdit &&
      <AddEditnoteForm 
      noteToEdit={noteToEdit}
      closeButton={() => setNoteToEdit(null)}
      onNoteSaved={(updatednote) => {
        setNotes(notes.map(existingNote => existingNote._id===updatednote._id ? updatednote : existingNote))
        setNoteToEdit(null)
      }}
      />}
    
    </>
  )
}

export default NotesPageLoggedinView