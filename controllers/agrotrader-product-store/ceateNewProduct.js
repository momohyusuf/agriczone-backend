const BadRequestError = require('../../errors/badRequestError');
const Product = require('../../models/traderStoreModel');
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createNewProduct = async (req, res) => {
  const { price, productDescription, productTitle, productPriceNegotiable } =
    req.body;

  if (!price) {
    throw new BadRequestError('Provide item price');
  }

  if (!productTitle) {
    throw new BadRequestError('Provide product title');
  }

  // uploading product image
  const imageMaxSize = 5000000;

  if (!req?.files?.productImage) {
    throw new BadRequestError('Provide product image');
  }

  if (req?.files?.productImage) {
    if (!req.files.productImage.mimetype.startsWith('image')) {
      throw new BadRequestError('Image file only');
    }
  }

  if (req.files.productImage.size > imageMaxSize) {
    throw new BadRequestError('Image cannot be greater than 5mb');
  }
  result = await cloudinary.uploader.upload(
    req.files.productImage.tempFilePath,
    {
      use_filename: true,
      folder: 'agriczone-trader-products',
      colors: true,
      transformation: [
        { fetch_format: 'webp' },
        { gravity: 'auto:face', crop: 'fill' },
        { height: 400, width: 400, crop: 'fit' },
      ],
    }
  );
  fs.unlinkSync(req.files.productImage.tempFilePath);

  const product = await Product.create({
    productTitle,
    productDescription,
    productImage: result?.secure_url,
    public_id: result?.public_id,
    price,
    productPriceNegotiable,
    trader: req.user._id,
  });

  res.status(StatusCodes.CREATED).json({ message: 'Product added to store' });
};

module.exports = {
  createNewProduct,
};
