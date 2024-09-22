
import fs from 'fs';
import mongoose from "mongoose";
import { Clothes } from '../models/Clothes.js';


export const getClothes = async (req, res) => {

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

    let query = Clothes.find(JSON.parse(qStr));


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


    const clothes = await query.skip(skip).limit(limit);
    const length = await Clothes.countDocuments();

    return res.status(200).json({
      clothes,
      length
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}


export const getClothById = async (req, res) => {
  const { id } = req.params;
  try {
    const clothes = await Clothes.findById(id).select('-createdAt -updatedAt -__v');
    return res.status(200).json(clothes);
  } catch (er) {
    return res.status(400).json({ error: `${err}` });
  }
}




export const addClothes = async (req, res) => {
  const {
    clothes_name,
    pet_type,
    description,
    image,
    stock,
    price } = req.body;
  try {
    await Clothes.create({
      clothes_name,
      pet_type,
      description,
      image,
      price: Number(price),
      stock: Number(stock)
    });
    return res.status(200).json({ message: 'clothes added succesfully' });
  } catch (err) {

    return res.status(400).json({ message: `${err}` });
  }
}



export const updateClothes = async (req, res) => {
  const { id } = req.params;

  try {

    if (mongoose.isValidObjectId(id)) {
      const isExist = await Food.findById(id);
      if (isExist) {
        const updateObj = {
          clothes_name: req.body.clothes_name || isExist.clothes_name,
          pet_type: req.body.pet_type || isExist.pet_type,
          image: req.body.image || isExist.image,
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







export const removeClothes = async (req, res) => {
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

