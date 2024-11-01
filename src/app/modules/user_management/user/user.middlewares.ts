import { NextFunction, Request, Response } from "express";

const convertUpdateProfileFormDataToObject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { profile, ...user } = req.body;
  //   eslint-disable-next-line @typescript-eslint/no-explicit-any
  let modifiedUser: any = JSON.stringify(user);
  modifiedUser = JSON.parse(modifiedUser);

  const modifiedProfile = {
    ...profile,
    picture: req?.file?.path,
    picPublicId: req.file?.filename,
  };

  req.body = {
    user: modifiedUser.user,
    profile: modifiedProfile,
  };

  next();
};

export const UserMiddlewares = {
  convertUpdateProfileFormDataToObject,
};
