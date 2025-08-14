import dotenv from "dotenv";

dotenv.config();
interface ConfigEnv {
  PORT: string;
  MONGO_URL: string;
  NODE_ENV: "development" | "production";
}
const loadEnvVariables = (): ConfigEnv => {
  const requiredEnvVariables: string[] = ["PORT", "MONGO_URL", "NODE_ENV"];
  requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not defined`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MONGO_URL: process.env.MONGO_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};
export const configEnv: ConfigEnv = loadEnvVariables();
