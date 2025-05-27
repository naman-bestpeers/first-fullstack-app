import { Request, Response } from "express";
import { prismaClient } from "..";
import { notFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { orderStatus, OrderStatusUpdateSchema } from "../schema/order";

export const createOrder = async (req: Request, res: Response) => {
  return prismaClient.$transaction(async (tq) => {
    const cartItems = await tq.cartItems.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length === 0) {
      return res.json({ message: "Cart is empty." });
    }

    const price = cartItems.reduce((acc, pr) => {
      return acc + pr.quantity * +pr.product.price;
    }, 0);

    const address = await tq.address.findFirst({
      where: {
        id: req.user?.defaultShippingAddress || undefined,
      },
    });

    const order = await tq.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address?.formattedAddress || "",
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    const orderEvent = await tq.orderEvents.create({
      data: {
        orderId: order.id,
      },
    });
    await tq.cartItems.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(order);
  });
};

export const orderList = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: "CANCELED",
      },
    });
    await prismaClient.orderEvents.create({
      data: {
        orderId: order.id,
        status: "CANCELED",
      },
    });
    res.json(order);
  } catch (error) {
    throw new notFoundException("Order not found.", ErrorCodes.NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new notFoundException("Order not found.", ErrorCodes.NOT_FOUND);
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.body.status;
  if (status) {
    whereClause = {
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +(req.query.offset || 0),
    take: +(req.query.limit || 10),
  });
  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const validateStatus = OrderStatusUpdateSchema.parse(req.body);
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: validateStatus.status,
      },
    });
    await prismaClient.orderEvents.create({
      data: {
        orderId: order.id,
        status: validateStatus.status,
      },
    });
    res.json(order);
  } catch (error) {
    throw new notFoundException("Order not found.", ErrorCodes.NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  try {
    const validateStatus = req.body? OrderStatusUpdateSchema.parse(req.body) : null;

    let whereClause: { userId: number; status?: orderStatus } = {
      userId: +req.params.id,
    };
    const status = validateStatus?.status;
    if (status) {
      whereClause = {
        ...whereClause,
        status,
      };
    }
    const orders = await prismaClient.order.findMany({
      where: whereClause,
      skip: +(req.query.offset || 0),
      take: +(req.query.limit || 10),
    });
    res.json(orders);
  } catch (error) {
    throw new notFoundException("Order not found.", ErrorCodes.NOT_FOUND);
  }
};
