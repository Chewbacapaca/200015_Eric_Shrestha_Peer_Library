const express = require("express");
const { newOrderCoin, getSingleOrderCoin, myOrderCoins, sellerOrderCoins, updateOrderCoin, getAllOrderCoins, deleteOrderCoins } = require("../controllers/orderCoinController");

const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/orderCoin/new").post(isAuthenticatedUser, newOrderCoin)
router.route("/orderCoin/:id").get(isAuthenticatedUser, getSingleOrderCoin)
router.route("/orderCoins/me").get(isAuthenticatedUser, myOrderCoins)
router.route("/coinsales/me").get(isAuthenticatedUser, sellerOrderCoins)
router.route("/orderCoin/:id").put(isAuthenticatedUser, updateOrderCoin)
router.route("/admin/orderCoins").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrderCoins)
router.route("/admin/orderCoin/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrderCoins)

module.exports = router;