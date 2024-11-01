import { NextFunction, Request, Response } from "express";
import parser from "ua-parser-js";
import TUserAgent from "../../types/userAgent";

const userAgent = (req: Request, res: Response, next: NextFunction) => {
  const ua: TUserAgent = parser(req.headers["user-agent"]);
  req.userAgent =
    (JSON.stringify(ua, null, "  ") as unknown as TUserAgent) || undefined;
  next();
};

export default userAgent;
