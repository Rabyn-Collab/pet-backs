import express from "express";
import { notAllowed } from "../utils/shareFunc.js";
import { addFood, getFoodById, getFoods, removeFood, updateFood } from "../controllers/foodController.js";


const router = express.Router();


router.route('/').get(getFoods).post(addFood).all(notAllowed);


router.route('/:id').get(getFoodById).patch(updateFood).delete(removeFood).all(notAllowed);


export default router;