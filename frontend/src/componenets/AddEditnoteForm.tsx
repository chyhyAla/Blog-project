import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Note } from '../models/note'
import { useForm } from 'react-hook-form'
import { Noteinput } from '../network/notes_api'
import * as NotesApi from "../network/notes_api"
import TextInputField from './form/TextInputField'

interface AddEditNoteProps {
  noteToEdit?: Note,
  closeButton: () => void,
  onNoteSaved: (note: Note) => void,
}

const AddEditnoteForm = ({ noteToEdit ,   closeButton , onNoteSaved}: AddEditNoteProps) =>{ 

  const { register , handleSubmit, formState: { errors, isSubmitting}} = useForm<Noteinput>({
    defaultValues: {
      title: noteToEdit?.title || "" , 
      text: noteToEdit?.text || ""
    }
  });

  async function onsubmit(input : Noteinput) {
     try {
      let noteResponse: Note;
      if(noteToEdit){
        noteResponse = await NotesApi.updateNote(noteToEdit._id , input)
      }else{
         noteResponse = await NotesApi.createNote(input)

      }
    
    onNoteSaved(noteResponse)
  } catch (error) {
    console.error(error);
    alert(error)
    
  }
  }
 
    
  
  return (
    <Modal show onHide={closeButton}>
      <Modal.Header closeButton>
        <Modal.Title>
            {noteToEdit? "Edit Note" : "Add Note"}
        </Modal.Title>
      </Modal.Header>


      <Modal.Body>
        <Form id='addEditNoteForm' onSubmit={handleSubmit(onsubmit)}>
          <TextInputField
            name='title'
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{required:"Required" }}
            error={errors.title}
          
          />

          <TextInputField
          name='text'
          label='Text'
          as ="textarea"
          rows={5}
          placeholder="Text"
          register={register}
          />

        </Form> 
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit'
        form='addEditNoteForm'
        disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddEditnoteForm