import { createClient } from "redis";
import { env } from "../config";
import { Logger } from "../utilities";

const redisClient = createClient({
  url: env.redis_url,
});

redisClient.on("error", (err) => Logger.console.error("RedisError", err));
redisClient.on("connect", () => Logger.console.info("Redis connected"));

const connect = async (): Promise<void> => {
  await redisClient.connect();
};

const get = async (key: string) =>
  JSON.parse((await redisClient.get(key)) || "null");

const setEx = async (key: string, seconds: number, value: string) =>
  await redisClient.setEx(key, seconds, JSON.stringify(value));

const del = async (key: string) => await redisClient.del(key);

export const RedisClient = {
  connect,
  get,
  setEx,
  del,
};
