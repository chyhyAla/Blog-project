import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${input}`, init);

  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;

    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        `Request failed with status ${response.status}, message: ${errorMessage}`
      );
    }
  }
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes", { method: "GET" });
  return response.json();
}

export interface Noteinput {
  title: string;
  text?: string;
}

export async function createNote(note: Noteinput): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData("/api/notes/" + noteId, { method: "DELETE" });
}
export async function updateNote(
  noteId: string,
  note: Noteinput
): Promise<Note> {
  const response = await fetchData("/api/notes/" + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}
