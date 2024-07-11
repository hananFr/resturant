import { model, Schema } from "mongoose";

const userSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "customer",
  },
  prevOrders: {
    type: Array,
    default: [],
  },
});

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string()
      .matches(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  });
  return Joi.validate(user, schema);
};

const User = model("User", userSchema);
export default User;
