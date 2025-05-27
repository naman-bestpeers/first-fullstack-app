import { Request, Response } from "express";
import { CartSchema, UpdateQuantitySchema } from "../schema/cart";
import { notFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { prismaClient } from "..";
import { Product } from "@prisma/client";

export const addItemToCart = async (req: Request, res: Response) => {
  const validateData = CartSchema.parse(req.body);
  let product: Product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: req.body.productId,
      },
    });
  } catch (error) {
    throw new notFoundException(
      "Product not found.",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }

  try {
    const checkProduct = await prismaClient.cartItems.findFirst({
      where: {
        productId: product.id,
        userId: req.user.id,
      },
    });
    if (checkProduct) {
      const cart = await prismaClient.cartItems.update({
        where: {
          id: checkProduct.id,
        },
        data: {
          quantity: validateData.quantity,
        },
      });
      res.json(cart);
    } else {
      const cart = await prismaClient.cartItems.create({
        data: {
          productId: product.id,
          userId: req.user.id,
          quantity: validateData.quantity,
        },
      });

      console.log(cart, "cart");
      res.json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    let cartItem = await prismaClient.cartItems.findFirstOrThrow({
      where: {
        id: +req.params.id,
      }
    })
    await prismaClient.cartItems.delete({
      where: {
        id: cartItem.id,
      },
    });
    res.json({
      status: true,
      message: "Product removed from cart.",
    });
  } catch (error) {
    throw new notFoundException(
      "product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const validateData = UpdateQuantitySchema.parse(req.body);
    const updatedCart = await prismaClient.cartItems.update({
      where: {
        id: +req.params.id,
      },
      data: {
        quantity: validateData.quantity,
      }
    })
    res.json(updatedCart);
  } catch (error) {
    throw new notFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

export const getCart = async (req: Request, res: Response) => {
  const carts = await prismaClient.cartItems.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      product: true,
    }
  });
  
  res.json(carts);
};
