import { createClient } from "redis";
import config from "../config";
import { logger } from "../utilities/logger/logger";

const redisClient = createClient({
  url: config.redis_url,
});

redisClient.on("error", (err) => logger.console.error("RedisError", err));
redisClient.on("connect", () => logger.console.info("Redis connected"));

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
