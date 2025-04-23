/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubscriptionType } from "@prisma/client";
import { RedisClient } from "../../shared";

/*===============================
          User cache
==================================*/
const getUserCache = async (userId: string) => {
  return await RedisClient.get(`user:${userId}`);
};

const setUserCache = async (userId: string, data: any) => {
  return await RedisClient.setEx(`user:${userId}`, 3600, data);
};

const deleteUserCache = async (userId: string) => {
  return await RedisClient.del(`user:${userId}`);
};

/*===============================
          Device cache
==================================*/
const getDeviceCache = async (tokenId: string) => {
  return await RedisClient.get(`device:${tokenId}`);
};

const setDeviceCache = async (tokenId: string, data: any) => {
  return await RedisClient.setEx(`device:${tokenId}`, 3600, data);
};

const deleteDeviceCache = async (tokenId: string) => {
  return await RedisClient.del(`device:${tokenId}`);
};

/*===============================
      Subscription plan cache
==================================*/

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

/*===============================
    All Subscription plan cache
==================================*/

const getAllSubscriptionPlanCache = async () => {
  return await RedisClient.get(`allSubscriptionPlan`);
};

const setAllSubscriptionPlanCache = async (data: any) => {
  return await RedisClient.setEx(`allSubscriptionPlan`, 864000, data);
};

const deleteAllSubscriptionPlanCache = async () => {
  return await RedisClient.del(`allSubscriptionPlan`);
};

/*===============================
          URL cache
==================================*/

const getUrlCache = async (shortCode: string) => {
  return await RedisClient.get(`url:${shortCode}`);
};

const setUrlCache = async (shortCode: string, data: any) => {
  return await RedisClient.setEx(`url:${shortCode}`, 345600, data);
};

const deleteUrlCache = async (shortCode: string) => {
  return await RedisClient.del(`url:${shortCode}`);
};

/*===============================
        User's tags cache
==================================*/

const getTagsCache = async (userId: string) => {
  return await RedisClient.get(`tags:${userId}`);
};

const setTagsCache = async (userId: string, data: any) => {
  return await RedisClient.setEx(`tags:${userId}`, 345600, data);
};

const deleteTagsCache = async (userId: string) => {
  return await RedisClient.del(`tags:${userId}`);
};

/*===============================
        Profile cache
==================================*/

const getUserProfileCache = async (userId: string) => {
  return await RedisClient.get(`userProfile:${userId}`);
};

const setUserProfileCache = async (userId: string, data: any) => {
  return await RedisClient.setEx(`userProfile:${userId}`, 604800, data);
};

const deleteUserProfileCache = async (userId: string) => {
  return await RedisClient.del(`userProfile:${userId}`);
};

export const CacheManager = {
  getUserCache,
  setUserCache,
  deleteUserCache,
  getDeviceCache,
  setDeviceCache,
  deleteDeviceCache,
  getSubscriptionPlanCache,
  setSubscriptionPlanCache,
  deleteSubscriptionPlanCache,
  getUrlCache,
  setUrlCache,
  deleteUrlCache,
  getTagsCache,
  setTagsCache,
  deleteTagsCache,
  getUserProfileCache,
  setUserProfileCache,
  deleteUserProfileCache,
  getAllSubscriptionPlanCache,
  setAllSubscriptionPlanCache,
  deleteAllSubscriptionPlanCache,
};
