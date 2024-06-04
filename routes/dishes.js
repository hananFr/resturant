import express from "express";
import { deleteDish, getDish, getDishes, postDish, putDish } from "../controllers/dishController.js";
import auth from "../middlewares/auth.js";
import { uploadFile } from "../middlewares/multer.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dish management
 */

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: List of all dishes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   available:
 *                     type: boolean
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', getDishes);

/**
 * @swagger
 * /api/dishes/{id}:
 *   get:
 *     summary: Get dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 available:
 *                   type: boolean
 *                 imageUrl:
 *                   type: string
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getDish);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Create a new dish
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dish created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', auth("admin"), uploadFile.single('image'), postDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   put:
 *     summary: Update dish by ID
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', auth("admin"), putDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   delete:
 *     summary: Delete dish by ID
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', auth("admin"), deleteDish);

export default router;
