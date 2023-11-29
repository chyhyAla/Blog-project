import express from "express";
import * as NotesControllers from "../controllers/notes";

const Router = express.Router();
Router.get("/", NotesControllers.getAllnotes);
Router.get("/:noteid", NotesControllers.getNote);

Router.post("/", NotesControllers.createNote);

Router.patch("/:noteid", NotesControllers.updateNote);

Router.delete("/:noteid", NotesControllers.deleteNote);

export default Router;
