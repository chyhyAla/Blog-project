import axios, { AxiosRequestConfig } from "axios";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";

export async function fetchData(url: string, config?: AxiosRequestConfig) {
  const response = await axios(url, config);
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
        "Request failed with status: " +
          response.status +
          " message: " +
          errorMessage
      );
    }
  }
}
