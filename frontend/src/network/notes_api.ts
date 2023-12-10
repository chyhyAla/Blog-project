import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";

async function fetchData(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, init);

    if (response.ok) {
      // Check if the content-type is JSON before trying to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
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
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData(`${baseUrl}/api/users`, { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData(`${baseUrl}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await fetchData(`${baseUrl}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    console.log("Raw response:", response);
    console.log("Response headers:", response.headers);

    console.log("test");
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to log in");
  }
}

export async function logout() {
  await fetchData(`${baseUrl}/api/users/logout`, { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData(`${baseUrl}/api/notes`, {
    method: "GET",
    credentials: "include",
  });
  return response;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData(`${baseUrl}/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData(`${baseUrl}/api/notes/${noteId}`, { method: "DELETE" });
}
