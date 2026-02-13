/* eslint-disable no-console */
import { createClient } from "redis";
import { configEnv } from "./env";

export const redisClient = createClient({
  username: configEnv.REDIS_USERNAME,
  password: configEnv.REDIS_PASSWORD,
  socket: {
    host: configEnv.REDIS_HOST,
    port: Number(configEnv.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();

// await client.set("foo", "bar");
// const result = await client.get("foo");
// console.log(result); // >>> bar

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};
