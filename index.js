const express = require('express');
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const agroTraderProductRoutes = require('./routes/agroTraderProductRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentsRoutes');
const premiumSubscriberRoutes = require('./routes/premiumSubscriberRoutes');
const connectToDB = require('./database-connection/connectDB');
const routeNotFoundError = require('./middlewares/routeNotFoundError');
const errorHandlerMiddleware = require('./middlewares/errorHandler');

//Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// middleware
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://agriczone.vercel.app');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan('tiny'));

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/product', agroTraderProductRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/premium', premiumSubscriberRoutes);

// errors handler
app.use(routeNotFoundError);
app.use(errorHandlerMiddleware);

////////////////////////////////////////
const startServer = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`App has connected to server on port ${port}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
