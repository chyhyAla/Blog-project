import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";

async function handleResponse(response: Response): Promise<any> {
  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response is not in JSON format");
    }
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error || "Unknown error";
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw new Error(
        `Request failed with status: ${response.status}, message: ${errorMessage}`
      );
    }
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetch(`${baseUrl}/api/users`, { method: "GET" });
  return handleResponse(response);
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetch(`${baseUrl}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
  return handleResponse(response);
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${baseUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function logout() {
  const response = await fetch(`${baseUrl}/api/users/logout`, {
    method: "POST",
  });
  return handleResponse(response);
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch(`${baseUrl}/api/notes`, {
    method: "GET",
    headers: {
      // Add Content-Type if needed
    },
    credentials: "include",
  });

  console.log("Response:", response);
  console.log("Headers:", response.headers);

  return handleResponse(response);
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetch(`${baseUrl}/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function deleteNote(noteId: string) {
  const response = await fetch(`${baseUrl}/api/notes/${noteId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
}
