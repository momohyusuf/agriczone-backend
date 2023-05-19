const BadRequestError = require('../../errors/badRequestError');
const Product = require('../../models/traderStoreModel');
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;

// get a single user items
const traderStoreItems = async (req, res) => {
  const userId = req.query.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  const product = await Product.find({ trader: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await Product.countDocuments({ trader: userId });
  const hasMore = totalCount > page * limit;
  res.status(StatusCodes.OK).json({
    product,
    hasMore,
  });
};

// find all the items based on the provided value by a user
const filterStoreItemsByTitle = async (req, res) => {
  const { searchTerm } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  const products = await Product.aggregate([
    { $match: { productTitle: { $regex: new RegExp(searchTerm, 'i') } } },
    { $addFields: { random: { $rand: {} } } },
    { $sort: { isPremiumUser: -1, random: 1 } },
    {
      $project: {
        createdAt: 1,
        fullName: 1,
        isPremiumUser: 1,
        price: 1,
        productDescription: 1,
        productImage: 1,
        productPriceNegotiable: 1,
        productTitle: 1,
        public_id: 1,
        trader: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalCount = await Product.countDocuments({
    productTitle: { $regex: new RegExp(searchTerm, 'i') },
  });
  const hasMore = totalCount > page * limit;
  res.status(StatusCodes.OK).json({
    products,
    hasMore,
  });
};

// delete a product from store
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.query;
  await Product.deleteOne({ _id: id });
  await cloudinary.uploader.destroy(public_id);

  res.status(StatusCodes.OK).json({ message: 'Product deleted' });
};

module.exports = {
  traderStoreItems,
  filterStoreItemsByTitle,

  deleteProduct,
};
