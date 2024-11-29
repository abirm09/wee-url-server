import { Url } from "@prisma/client";
import { prisma } from "../../../app";
import { TJWTPayload } from "../../../types";
import { URLHelper } from "./url.helper";

const createIntoDB = async (url: Url, user: TJWTPayload) => {
  return prisma.$transaction(async (tx) => {
    await URLHelper.createNewUrl(url, user, tx);
  });
};

export const URLService = {
  createIntoDB,
};
