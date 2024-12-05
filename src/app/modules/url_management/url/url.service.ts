import { Url } from "@prisma/client";
import { prisma } from "../../../../app";
import { TJWTPayload } from "../../../../types";
import { URLHelper } from "./url.helper";

const createIntoDB = async (url: Url, user: TJWTPayload) => {
  return prisma.$transaction(async (tx) => {
    await URLHelper.createNewUrl(url, user, tx);
  });
};

const getAllUserFromDB = async (
  user: TJWTPayload,
  query: Record<string, unknown>
) => {
  // eslint-disable-next-line no-console
  console.log(query, user);
};

export const URLService = {
  createIntoDB,
  getAllUserFromDB,
};
