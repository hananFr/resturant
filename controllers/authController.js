import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import fs from 'fs';
import User, { validateUser } from '../models/user.js';
import { throwError } from '../utils/functionHelper.js';


export const postSignup = async (req, res, next) => {
  try {
    if (validateUser(req.body).error) throwError(validateUser(req.body).error.details[0].message, 422);

    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (user) throwError("User already exists", 409);

    user = new User(req.body);
    const hashPassword = await bcrypt.hash(user.password, 12);
    user.password = hashPassword;
    const result = await user.save();
    if (!result) throwError("Server Error", 500);
    res.redirect(201, '/login')
  } catch (error) {
    return next(error);
  };
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) throwError("User not found", 404);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) throwError("Unathorized", 403);
    const token = Jwt.sign({
      _id: user._id,
      role: user.role,
      email: user.email,
    }, privateKey, { algorithm: "RS256" }, { expiresIn: '30d' });
    if (!token) throwError("Something went wrong", 500);
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

export const getLogout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throwError("Unauthorized", 403);
    Jwt.destroy(token);
    res.status(200).json("Logged out");
  } catch (error) {
    next(error);
  }
};