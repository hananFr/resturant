import Order, { validateOrder } from "../models/order.js";
import { ObjectId } from "mongoose";
import paypal from "@paypal/checkout-server-sdk";
import { throwError } from "../utils/functionHelper.js";
const client = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET));



export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    orders.map(order => order.userId = order.userId.toString());
    if (!orders) throwError("Server Error", 500);
    if (!orders.length) throwError("No orders found", 404);
    res.status(200).json(orders);
  } catch (error) {
    return next(error);
  };
};

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    order._id = order._id.toString();
    if (!order) throwError("Order is not found", 404);
    res.status(200).json(order);
  } catch (error) {
    return next(error);
  };
};

export const postOrder = async (req, res, next) => {
  try {
    const validation = validateOrder(req.body);
    if (validation.error) throwError(validation.error.details[0].message, 422);
    
    const totalPrice = req.body.dishes.reduce((acc, dish) => acc + dish.price, 0).toFixed(2);
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "ILS",
            value: totalPrice,
          },
        },
      ],
    });

    const response = await client.execute(request);
    if (response.statusCode !== 201) throwError("Paypal error", 500);

    const order = new Order({
      ...req.body,
      userId: req.userId,
      totalPrice: parseFloat(totalPrice), 
      paymentStatus: 'pending',
      paymentId: response.result.id
    });

    const result = await order.save();
    if (!result) throwError('Create Order Failed', 500);

    order.paymentStatus = 'completed';
    await order.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const deleteOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const result = await Order.findByIdAndDelete(orderId);
    if(!result) throwError("Delete order faild");
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  };
};