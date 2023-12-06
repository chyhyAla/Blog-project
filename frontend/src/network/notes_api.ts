import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${input}`, init);

  try {
    const data = await response.json();

    if (!response.ok) {
      console.error("Response status:", response.status);
      console.error("Error message:", data.error);

      if (response.status === 401) {
        throw new UnauthorizedError(data.error);
      } else if (response.status === 409) {
        throw new ConflictError(data.error);
      } else {
        throw Error(
          `Request failed with status ${response.status}, message: ${data.error}`
        );
      }
    }

    return data;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw Error("Failed to parse response");
  }
}

export async function fetchNotes(): Promise<Note[]> {
  return fetchData("/api/notes", { method: "GET" });
}

export interface Noteinput {
  title: string;
  text?: string;
}

export async function createNote(note: Noteinput): Promise<Note> {
  return fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
}

export async function deleteNote(noteId: string) {
  return fetchData("/api/notes/" + noteId, { method: "DELETE" });
}

export async function updateNote(
  noteId: string,
  note: Noteinput
): Promise<Note> {
  return fetchData("/api/notes/" + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
}
