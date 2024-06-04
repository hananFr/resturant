import Jwt from "jsonwebtoken";
import User, { validateUser } from "../models/user.js"
import { throwError } from "../utils/functionHelper.js";
import bcrypt from 'bcrypt';
import fs from 'fs'


const privateKey = fs.readFileSync('./private_key.pem', 'utf8');

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    if (!users) throwError("Server Error", 500);
    if (!users.length) throwError("No users found", 404);
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  };
};

export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = User.findById(id);
    if (!user) throwError("User is not found", 404);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  };
};


export const putProfile = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if(req.body.password) throwError("Password cannot be updated here", 422);
    if (userId !== req.userId) throwError("Unauthorized", 403);
    const result = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(`user ${result.name} updated`);
  } catch (error) {
    return next(error);
  };
};

export const putUserPassword = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (userId !== req.userId) throwError("Unauthorized", 403);
    const user = await User.findById(userId);
    const verifyPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!verifyPassword) throwError("Unauthorized", 403);
    const hashPassword = await bcrypt.hash(req.body.newPassword, 12);
    user.password = hashPassword;
    const result = await user.save();
    res.status(200).json(`Password updated`);
  } catch (error) {
    return next(error);
  }
}

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(req.userId);
    if (user._id.toString() !== userId && user.role !== 'admin') throwError("Unauthorized", 403);
    const result = User.findByIdAndDelete(userId);
    res.status(200).json(`User ${result.name} deleted`);
  } catch (error) {
    return next(error);
  };
};

export const changeUserRole = async (req, res, next) => {
  const userId = req.params.id;
  const role = req.body.role;
  try {
    const user = await User.findById(userId);
    if (!user) throwError("User not found", 404);
    user.role = role;
    const result = user.save();
    res.status(200).json(`User ${result.name} role changed to ${role}`);
  } catch (error) {
    return next(error);
  };
}