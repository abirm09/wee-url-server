import { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";

const userIp = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = requestIp.getClientIp(req);
  req.userIp = clientIp || undefined;
  next();
};

export default userIp;
