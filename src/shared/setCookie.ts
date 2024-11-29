import { CookieOptions, Response } from "express";
import { env } from "../config";

type TSetCookiePayload = {
  cookieName: string;
  value: string;
  cookieOption: CookieOptions;
};

export const setCookie = (res: Response, payload: TSetCookiePayload) => {
  const { cookieName, value, cookieOption } = payload;
  const { maxAge } = cookieOption;

  return res.cookie(cookieName, value, {
    domain:
      env.env === "production" ? `.${env.client_side_domain}` : "localhost",
    httpOnly: env.env === "production",
    secure: env.env === "production",
    sameSite: "lax",
    maxAge,
  });
};
