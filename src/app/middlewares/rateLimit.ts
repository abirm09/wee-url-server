import { NextFunction, Request, Response } from "express";
import expressRateLimit from "express-rate-limit";

/**
 * The `rateLimit` function sets up rate limiting for requests with a specified window of time and
 * maximum number of requests, returning a middleware function for Express.
 * @param {number} [windowMs=10] - The `windowMs` parameter represents the length of the time window in
 * milliseconds during which the rate limiting is applied. In the provided code snippet, the `windowMs`
 * parameter is set to a default value of 10 minutes (10 * 60 * 1000 milliseconds).
 * @param {number} [maxRequest=5] - The `maxRequest` parameter in the `rateLimit` function specifies
 * the maximum number of requests allowed within the defined `windowMs` time window. In this case, it
 * is set to a default value of 5, meaning that a client can make up to 5 requests within the specified
 * time
 * @param {string} [message=Too many attempts] - The `message` parameter in the `rateLimit` function is
 * a string that specifies the message to be displayed when the rate limit is exceeded. In this case,
 * the default message is "Too many attempts".
 * @returns The `rateLimit` function is returning a middleware function that applies rate limiting to
 * incoming requests. This middleware function uses the `express-rate-limit` package to limit the
 * number of requests that can be made within a specified window of time. The function takes three
 * parameters: `windowMs` (the time window in minutes), `maxRequest` (the maximum number of requests
 * allowed within the window), and
 */
const rateLimit = (
  windowMs: number = 10,
  maxRequest: number = 5,
  message: string = "Too many attempts. Please try again later"
) => {
  const limiter = expressRateLimit({
    windowMs: windowMs * 60 * 1000,
    max: maxRequest,
    message: {
      success: false,
      message,
      errorMessages: [
        {
          path: "",
          message,
        },
      ],
    },
  });

  return (req: Request, res: Response, next: NextFunction) =>
    limiter(req, res, next);
};

export default rateLimit;
