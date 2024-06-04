import Menu from "../models/menu.js"
import { compareObjects, throwError } from "../utils/functionHelper.js";

export const getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find({});
    if (!menus) throwError("Serever Error", 500);
    if (!menus.length) throwError('No menus found', 404);
    res.status(200).json(menus);
  } catch (error) {
    return next(error);
  };
};

export const getMenu = async (req, res, next) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    if (!menu) throwError("Menu is not found", 404);
  } catch (error) {
    return next(error);
  };
};

export const postMenu = async (req, res, next) => {
  try {
    const menu = new Menu(req.body);
    const result = await menu.save();
    if (!result) throwError('Menu creating faild', 500);
    res.status(201).json(result);
  } catch (error) {
    return next(error);
  };
};

export const putMenu = async (req, res, next) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    compareObjects(req.body, menu);
    const result = await menu.save();
    if (!result) throwError("Menu updating faild", 500);
  } catch (error) {
    return next(error);
  };
};

export const deleteMenu = async (req, res, next) => {
  const menuId = req.params.id;
  try {
    const result = Menu.findByIdAndDelete(menuId);
    if(!result) throwError("Menu deleting faild", 404);
    res.status(200).json(`Menu ${result.name} deleted`);
  } catch (error) {
    return next(error);
  };
};