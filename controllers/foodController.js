import { Food } from "../models/Food.js"
import fs from 'fs';
import mongoose from "mongoose";


export const getFoods = async (req, res) => {

  try {
    const excludeObj = ['sort', 'page', 'search', 'fields', 'limit'];

    const queryObj = { ...req.query };

    excludeObj.forEach((q) => {
      delete queryObj[q]
    });

    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: 'i' }
    }

    let qStr = JSON.stringify(queryObj);
    qStr = qStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);

    let query = Food.find(JSON.parse(qStr));


    if (req.query.sort) {
      const sorting = req.query.sort.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');
      query.sort(sorting);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');
      query.select(fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;


    const foods = await query.skip(skip).limit(limit);
    const length = await Food.countDocuments();

    return res.status(200).json({
      foods,
      length
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}


export const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Food.findById(id).select('-createdAt -updatedAt -__v');
    return res.status(200).json(product);
  } catch (er) {
    return res.status(400).json({ error: `${err}` });
  }
}




export const addFood = async (req, res) => {
  const {
    food_name,
    pet_type,
    description,
    stock,
    image,
    price } = req.body;
  try {
    await Product.create({
      food_name,
      pet_type,
      description,
      image,
      price: Number(price),
      stock: Number(stock)
    });
    return res.status(200).json({ message: 'product added succesfully' });
  } catch (err) {

    return res.status(400).json({ message: `${err}` });
  }
}



export const updateFood = async (req, res) => {
  const { id } = req.params;

  try {

    if (mongoose.isValidObjectId(id)) {
      const isExist = await Food.findById(id);
      if (isExist) {
        const updateObj = {
          food_name: req.body.food_name || isExist.food_name,
          pet_type: req.body.pet_type || isExist.pet_type,
          description: req.body.description || isExist.description,
          stock: Number(req.body.stock) || isExist.stock,
          price: Number(req.body.price) || isExist.price,
        };

        await isExist.updateOne(updateObj);



        return res.status(200).json({ message: 'succesfully updated' });
      }

    }


    return res.status(400).json({ message: 'please provide valid id' });



  } catch (err) {

    return res.status(400).json({ message: `${err}` });
  }
}







export const removeFood = async (req, res) => {
  const { id } = req.params;
  try {

    if (mongoose.isValidObjectId(id)) {
      const isExist = await Food.findById(id);
      if (isExist) {
        await isExist.deleteOne();

        return res.status(200).json({ message: 'succesfully deleted' });
      }

    }


    return res.status(400).json({ message: 'please provide valid id' });

  } catch (err) {

    return res.status(400).json({ error: `${err}` });
  }
}

