/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubscriptionType } from "@prisma/client";
import { RedisClient } from "../../shared/redis";

const getUserCache = async (userId: string) => {
  return await RedisClient.get(`user:${userId}`);
};

const setUserCache = async (userId: string, data: any) => {
  // Use redisClient from the imported RedisClient object
  return await RedisClient.setEx(`user:${userId}`, 3600, data); // Set expiration to 1 hour
};

const deleteUserCache = async (userId: string) => {
  return await RedisClient.del(`user:${userId}`);
};

const getDeviceCache = async (tokenId: string) => {
  return await RedisClient.get(`device:${tokenId}`);
};

const setDeviceCache = async (tokenId: string, data: any) => {
  return await RedisClient.setEx(`device:${tokenId}`, 3600, data);
};

const deleteDeviceCache = async (tokenId: string) => {
  return await RedisClient.del(`device:${tokenId}`);
};

const getSubscriptionPlanCache = async (subscriptionPlan: SubscriptionType) => {
  return await RedisClient.get(`subscriptionPlan:${subscriptionPlan}`);
};

const setSubscriptionPlanCache = async (
  subscriptionPlan: SubscriptionType,
  data: any
) => {
  return await RedisClient.setEx(
    `subscriptionPlan:${subscriptionPlan}`,
    864000,
    data
  );
};

const deleteSubscriptionPlanCache = async (
  subscriptionPlan: SubscriptionType
) => {
  return await RedisClient.del(`subscriptionPlan:${subscriptionPlan}`);
};

export const RedisUtils = {
  getUserCache,
  setUserCache,
  deleteUserCache,
  getDeviceCache,
  setDeviceCache,
  deleteDeviceCache,
  getSubscriptionPlanCache,
  setSubscriptionPlanCache,
  deleteSubscriptionPlanCache,
};
