import Dish, { validateDish } from "../models/dish.js";
import { compareObjects, throwError } from "../utils/functionHelper.js";
import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find({});
    if (!dishes) throwError('Not Dishes Found', 500);
    if (!dishes.length) throwError('No Dishes Found', 404);
    return res.status(200).json(dishes);
  } catch (error) {
    return next(error);
  };
};

export const getDish = async (req, res, next) => {
  const id = req.params.id;
  try {
    const dish = await Dish.findById(id);
    if (!dish) throwError('Dish is not found', 404);
    res.status(200).json(dish);
  } catch (error) {
    error.status = 422;
    return next(error);
  }
}

export const postDish = async (req, res, next) => {
  try {
    if(!req.file) throwError("Image is required", 422);
    const uploader = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString('base64')}`,
      {folder: 'resturant'}
    );
    console.log(uploader);
    const dish = new Dish({...req.body, image: uploader.secure_url});
    if (validateDish(dish).error) throwError(validateDish(dish).error.details[0].message, 422);
    const result = await dish.save();
    res.status(201).json({
      msg: 'Dish added',
      dish: result
    });
  } catch (error) {
    return next(error);
  }
}

export const putDish = async (req, res, next) => {
  const id = req.params.id;
  try {
    let dish = await Dish.findById(id);
    if(req.file){
      const uploader = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.file.buffer.toString('base64')}`,
        {folder: 'resturant'}
      );
      const publicId = dish.image.split('/').slice(7).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      dish.image = uploader.secure_url;
    }
    if (!dish) throwError('Dish is not found', 404);
    compareObjects(req.body, dish);
    if (validateDish(dish).error) throwError(validateDish(dish).error.details[0].message, 422);
    const result = await dish.save();
    res.status(200).json({
      msg: 'Update dish Succeeded',
      dish: result
    })
  } catch (error) {
    return next(error);
  };
};

export const deleteDish = async (req, res, next) => {
  const id = req.params.id;
  try {
    const dish = await Dish.findById(id);
    if (!dish) throwError("Dish is not found", 404)
    const result = await dish.remove();
    if (!result) throwError("Delete dish faild", 500);
    res.status(200).json(`${result.name}  deleted`);
  } catch (error) {
    return next(error);
  }
}