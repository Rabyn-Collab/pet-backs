import express from "express";
import { notAllowed } from "../utils/shareFunc.js";
import { addClothes, getClothById, getClothes, removeClothes, updateClothes } from "../controllers/clothesController.js";

const router = express.Router();


router.route('/').get(getClothes).post(addClothes).all(notAllowed);


router.route('/:id').get(getClothById).patch(updateClothes).delete(removeClothes).all(notAllowed);


export default router;