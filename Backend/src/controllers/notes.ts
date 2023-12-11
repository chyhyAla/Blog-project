import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";
export const getAllnotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserName = req.session.userName;
  console.log("Authenticated User ID 1 :", authenticatedUserName);

  try {
    const notes = await NoteModel.find({
      userId: authenticatedUserName,
    }).exec();

    // Send the JSON response
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteid = req.params.noteid;
  const authenticatedUserName = req.session.userName;

  try {
    assertIsDefined(authenticatedUserName);
    if (!mongoose.isValidObjectId(noteid)) {
      throw createHttpError(400, "Invalid note id");
    }
    const note = await NoteModel.findById(noteid).exec();
    if (!note) {
      throw createHttpError(404, "Note Not found");
    }
    if (!(note.userName === authenticatedUserName)) {
      throw createHttpError(401, "You cannot access this note");
    }
    // console.log(note);
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}
export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const authenticatedUserName = req.session.userName;
  console.log("Authenticated User Name:", authenticatedUserName);

  try {
    // assertIsDefined(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "Note must have a title ");
    }

    const newNote = await NoteModel.create({
      userName: authenticatedUserName,
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

interface UpdateNoteParams {
  noteid: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}
export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteid = req.params.noteid;
  const newtitle = req.body.title;
  const newtext = req.body.text;
  const authenticatedUserName = req.session.userName;
  try {
    assertIsDefined(authenticatedUserName);

    if (!mongoose.isValidObjectId(noteid)) {
      throw createHttpError(400, "Invalid note id");
    }
    if (!newtitle) {
      throw createHttpError(400, "Note must have a title ");
    }

    const note = await NoteModel.findById(noteid).exec();
    if (!note) {
      throw createHttpError(404, "Note Not found");
    }

    if (!(note.userName === authenticatedUserName)) {
      throw createHttpError(401, "You cannot access this note");
    }
    note.title = newtitle;
    note.text = newtext;

    const updatedNote = await note.save();
    console.log(updatedNote);

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteid = req.params.noteid;
  const authenticatedUserName = req.session.userName;

  try {
    assertIsDefined(authenticatedUserName);

    if (!mongoose.isValidObjectId(noteid)) {
      throw createHttpError(400, "Invalid note id");
    }

    const note = await NoteModel.findById(noteid).exec();
    if (!note) {
      throw createHttpError(404, "Note Not found");
    }
    if (!(note.userName === authenticatedUserName)) {
      throw createHttpError(401, "You cannot access this note");
    }
    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {}
};
