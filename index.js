import express from "express";
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import clothesRoutes from './routes/clothesRoutes.js';
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import { Food } from "./models/Food.js";
import { Clothes } from "./models/Clothes.js";

const port = 5000;
AdminJS.registerAdapter({
  Database,
  Resource
});
const app = express();


mongoose.connect('mongodb+srv://rabyn900:moles900@cluster0.ikwdezp.mongodb.net/PetShop').then(() => {
  app.listen(port, () => {
    console.log('database connected');
  });

}).catch((err) => {
  console.log(err);
});




app.use(express.json());
app.use(cors({ origin: '*', }));
app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'));

app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 },
  abortOnLimit: true
}));



const start = async () => {

  // This facilitates the connection to the mongo database


  // We will need to create an instance of AdminJS with a basic resource
  const admin = new AdminJS({

    resources: [
      {
        resource: Food,

        options: {
          properties: {
            createdAt: { isVisible: false },
            updatedAt: { isVisible: false },
            rating: { isVisible: false },
          },


        }
      },
      {
        resource: Clothes,
        options: {

          properties: {
            createdAt: { isVisible: false },
            updatedAt: { isVisible: false },
            rating: { isVisible: false },
          },


        }
      },

    ]
  })

  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);
  app.use('/api/foods', foodRoutes);
  app.use('/api/clothes', clothesRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/orders', orderRoutes);



  app.get('/', (req, res) => {

    return res.status(200).json({ message: 'welcome to shopus' });
  });




}

start()




