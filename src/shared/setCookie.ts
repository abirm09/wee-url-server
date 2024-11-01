import { CookieOptions, Response } from "express";
import config from "../config";

type TSetCookiePayload = {
  cookieName: string;
  value: string;
  cookieOption: CookieOptions;
};

const setCookie = (res: Response, payload: TSetCookiePayload) => {
  const { cookieName, value, cookieOption } = payload;
  const { maxAge } = cookieOption;

  return res.cookie(cookieName, value, {
    domain:
      config.env === "production"
        ? `.${config.client_side_domain}`
        : "localhost",
    httpOnly: config.env === "production",
    secure: config.env === "production",
    sameSite: "lax",
    maxAge,
  });
};

export default setCookie;
