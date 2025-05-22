import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { unprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/user";
import { notFoundException } from "../exceptions/not-found";
const saltRound = 10;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignUpSchema.parse(req.body);
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      return next(
        new BadRequestException(
          "User already exists.",
          ErrorCodes.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, saltRound),
      },
    });

    // user.password && delete user?.password;

    const token = jwt.sign(
    {
      userId: user.id,
    },
    `${process.env.JWT_SECRET}`
  );

    res.json({
      status: true,
      message: 'User created successfully.',
      token,
      data: user,
    });
  } catch (error: any) {
    next(
      new unprocessableEntity(
        error?.couse?.issues,
        "Unprocessed Entity",
        ErrorCodes.UNPROCESSED_DATA
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new notFoundException("User not found.", ErrorCodes.USER_NOT_FOUND);
    return;
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Invalid Credential!",
      ErrorCodes.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    `${process.env.JWT_SECRET}`
  );

  res.json({
      status: true,
      message: 'Login successful.',
      token,
      data: user,
    });
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user);
};
