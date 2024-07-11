import { Schema, model } from "mongoose";

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  parentMenu: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
  },
});

export const validateDish = (dish) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    available: Joi.boolean().required(),
    parentMenu: Joi.string().required(),
  });
  return Joi.validate(dish, schema);
};

const Dish = model("Dish", dishSchema);
export default Dish;
