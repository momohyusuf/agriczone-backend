const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUser');
const {
  createNewProduct,
} = require('../controllers/agrotrader-product-store/ceateNewProduct');
const {
  traderStoreItems,
  deleteProduct,
} = require('../controllers/agrotrader-product-store/traderStoreItems');

router.post('/create-new-product', authenticateUser, createNewProduct);

router.get('/trader-store-items', traderStoreItems);
router.route('/:id').delete(authenticateUser, deleteProduct);
module.exports = router;
