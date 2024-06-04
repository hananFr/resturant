import { model, Schema } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  }],
  totalPrice: {
    type: Number
  },
  table:{
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending' | 'in progress' | 'completed'],
    default:'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending' | 'completed'],
    default:'pending'
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
});

export const validateOrder = (order) => {
  const schema = {
    userId: Joi.string().required(),
    dishes: Joi.array().items(Joi.string()).required(),
    table: Joi.number().required(),
    status: Joi.string().valid('pending', 'in progress', 'completed'),
  };
  return Joi.validate(order, schema);
};

const Order = model('Order', orderSchema);
export default Order;