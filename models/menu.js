import mongoose, { Schema } from "mongoose";

const menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish",
    },
  ],
  category: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

export const validateMenu = (menu) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    dishes: Joi.array().items(Joi.string()),
    category: Joi.string().required(),
    available: Joi.boolean(),
  });
  return Joi.validate(menu, schema);
};

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
