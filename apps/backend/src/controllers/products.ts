import { Request, Response } from "express";
import { prismaClient } from "..";
import { notFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
    },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      throw new notFoundException(
        "Product not found.",
        ErrorCodes.PRODUCT_NOT_FOUND
      );
    }
    const product = await prismaClient.product.update({
      data: { ...req.body },
      where: { id: parseInt(req.params.id) },
    });

    res.json(product);
  } catch (error) {
    throw new notFoundException(
      "Product not found.",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      throw new notFoundException(
        "Product not found.",
        ErrorCodes.PRODUCT_NOT_FOUND
      );
    }
    await prismaClient.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({
      status: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    throw new notFoundException(
      "Product not found.",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await prismaClient.product.findMany({
    skip: req.body.offset || 0,
    take: req.body.limit || 10,
  });
  const count = await prismaClient.product.count();

  res.json({
    count,
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      throw new notFoundException(
        "Product not found.",
        ErrorCodes.PRODUCT_NOT_FOUND
      );
    }
    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product?.id) {
      throw new notFoundException(
        "Product not found.",
        ErrorCodes.PRODUCT_NOT_FOUND
      );
    }

    res.json(product);
  } catch (error) {
    throw new notFoundException(
      "Product not found.",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  let searchData = typeof req.query.q === 'string'? req.query.q : req?.query.q? req?.query.q?.toString() : '';
  try {
    const products = await prismaClient.product.findMany({
      where: {
        title: {
          search: searchData,
        },
        description: {
          search: req.query.q?.toString(),
        },
        category: {
          search: req.query.q?.toString(),
        },
      },
      skip: +(req.query.offset || 0),
      take: +(req.query.limit || 10),
    });
    res.json(products);
  } catch (error) {
    throw new notFoundException('Products not found.', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};
