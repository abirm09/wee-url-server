/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { env } from "../../config";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}';`
  );
  return res.render("not-found", {
    nonce,
    clientSide: env.client_side_urls[0],
  });
};
