import { User } from "../models/user";

const baseUrl = "https://notes-app-api-m6rv.onrender.com";
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${input}`, init);

  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export async function getLogeedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });

  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function Signup(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/Signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
export interface LoginUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function Login(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function Logout() {
  await fetchData("/api/users/Logout", { method: "POST" });
}
