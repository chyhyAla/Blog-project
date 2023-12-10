import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";

function handleResponse(response: Response) {
  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      throw new Error("Response is not in JSON format");
    }
  } else {
    return response.json().then((errorBody) => {
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
    });
  }
}

export function getLoggedInUser(): Promise<User> {
  return fetch(`${baseUrl}/api/users`, { method: "GET" }).then(handleResponse);
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export function signUp(credentials: SignUpCredentials): Promise<User> {
  return fetch(`${baseUrl}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  }).then(handleResponse);
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export function login(credentials: LoginCredentials): Promise<User> {
  return fetch(`${baseUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  }).then(handleResponse);
}

export function logout() {
  return fetch(`${baseUrl}/api/users/logout`, { method: "POST" }).then(
    handleResponse
  );
}

export function fetchNotes(): Promise<Note[]> {
  return fetch(`${baseUrl}/api/notes`, {
    method: "GET",
    credentials: "include",
  }).then(handleResponse);
}

export interface NoteInput {
  title: string;
  text?: string;
}

export function createNote(note: NoteInput): Promise<Note> {
  return fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }).then(handleResponse);
}

export function updateNote(noteId: string, note: NoteInput): Promise<Note> {
  return fetch(`${baseUrl}/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }).then(handleResponse);
}

export function deleteNote(noteId: string) {
  return fetch(`${baseUrl}/api/notes/${noteId}`, { method: "DELETE" }).then(
    handleResponse
  );
}
