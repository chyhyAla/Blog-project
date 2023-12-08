import {  useForm } from "react-hook-form"
import { User } from "../models/user"
import { SignUpCredentials } from "../network/notes_api"
import * as NotesApi from "../network/notes_api"
import { Alert, Button, Form, Modal } from "react-bootstrap"
import TextInputField from "./form/TextInputField"
import styleUtils from "../styles/utils.module.css"
import { useState } from "react"
import { ConflictError } from "../errors/http_errors"


interface SignUpProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

export default function SignUpModel({onDismiss , onSignUpSuccessful}: SignUpProps) {
    const [errorText  , seterrorText] = useState<string|null>(null);

    const {register , handleSubmit , formState: {errors , isSubmitting}} = useForm<SignUpCredentials>()


    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await NotesApi.signUp(credentials);
            console.log(newUser);   
            onSignUpSuccessful(newUser);
            
        } catch (error) {
            if(error instanceof ConflictError){
                seterrorText(error.message)
            }else {
                alert(error)
            }
            
            console.error(error)
        }
        
    }
  return (
    <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
            <Modal.Title>
                Sign Up
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {errorText && 
            <Alert variant="danger">
                {errorText}
            </Alert>
            }
            <Form onSubmit={handleSubmit(onSubmit)}>
                <TextInputField
                name="username"
                label="Username"
                type="text"
                placeholder="Username"
                register={register}
                registerOptions={{required: "Required"}}
                error={errors.username}
                />
                <TextInputField
                name="email"
                label="Email"
                type="email"
                placeholder = "Username"
                register={register}
                registerOptions={{required: "Required"}}
                error={errors.email} 
                />
                <TextInputField
                name="password"
                label="Password"
                type="password"
                placeholder = "Password"
                register={register}
                registerOptions={{required: "Required"}}
                error={errors.password}
                />
                <Button 
                className={styleUtils.width100}
                type="submit"
                disabled={isSubmitting}
                
                >

                   Sign Up 
                </Button>
            </Form>
        </Modal.Body>
    </Modal>

    
  )
}
