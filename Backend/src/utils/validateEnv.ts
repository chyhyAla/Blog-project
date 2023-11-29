import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});
