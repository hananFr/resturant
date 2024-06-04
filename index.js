import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dishes from './routes/dishes.js';
import users from './routes/users.js';
import menus from './routes/menus.js';
import orders from './routes/orders.js';
import errorHandler from './middlewares/error.js';
import setupSwagger from './swagger.js';
import cors from 'cors';
const app = express();
const __dirname = process.cwd();
const PORT = process.env.PORT || 8080;
const mongoUri = process.env.MONGO_URI;

app.use(cors('*'));



try {
  await mongoose.connect(mongoUri);
  console.log('Mongoose is connecting...');
}
catch (error) {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurant');
    console.log('Mongoose is connecting to localhost...');
  }catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code
  }
}



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//router
app.use("/api/dishes", dishes);
app.use("/api/users", users);
app.use("/api/menus", menus);
app.use("/api/orders", orders);





app.use(errorHandler);

setupSwagger(app);

app.listen(PORT);




