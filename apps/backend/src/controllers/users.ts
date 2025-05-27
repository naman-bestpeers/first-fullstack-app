import { Request, Response } from "express";
import { AddressSchema, UpdateUserRoleSchema, UpdateUserSchema } from "../schema/user";
import { Address, User } from "@prisma/client";
import { prismaClient } from "..";
import { unprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";
import { notFoundException } from "../exceptions/not-found";
import { BadRequestException } from "../exceptions/bad-requests";
import { InternalEXception } from "../exceptions/internal-exception";
import { skip } from "node:test";

export const addAddress = async (req: Request, res: Response) => {
  try {
    AddressSchema.parse(req.body);

    const address = await prismaClient.address.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.send(address);
  } catch (error) {
    throw new unprocessableEntity(
      error,
      "Unprocessed Entity",
      ErrorCodes.UNPROCESSED_DATA
    );
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });
    res.send({
      status: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    throw new notFoundException(
      "Address not found.",
      ErrorCodes.ADDRESS_NOT_FOUND
    );
  }
};

export const getAllAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await prismaClient.address.findMany({
      skip: req.body?.offset || 0,
      take: req.body?.limit || 10,
    });
    res.send(addresses);
  } catch (error) {
    throw new InternalEXception(
      "Something went wrong.",
      error,
      ErrorCodes.INTERNAL_EXCEPTION
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const validateData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validateData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validateData?.defaultShippingAddress,
        },
      });
    } catch (error) {
      throw new notFoundException(
        "Address not found.",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        "Address does not belong to user.",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
  }

  if (validateData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validateData?.defaultBillingAddress,
        },
      });
    } catch (error) {
      throw new notFoundException(
        "Address not found.",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        "Address does not belong to user.",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: validateData,
  });

  res.json(updatedUser);
};

export const userList = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: +(req.query.offset || 0),
    take: +(req.query.limit || 10),
  });

  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresses: true,
      },
    });
    res.json(user);
  } catch (error) {
    throw new notFoundException("User not found.", ErrorCodes.USER_NOT_FOUND);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  // validation
  const validateData = UpdateUserRoleSchema.parse(req.body);
  try {
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: validateData.role,
      },
    });
    res.json(user);
  } catch (error) {
    throw new notFoundException("User not found.", ErrorCodes.USER_NOT_FOUND);
  }
};
