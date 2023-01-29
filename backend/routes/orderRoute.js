const express = require("express");
const { newOrder, getSingleOrder, myOrders, sellerOrders, updateOrder, getAllOrders, deleteOrders } = require("../controllers/orderController");
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder)
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)
router.route("/orders/me").get(isAuthenticatedUser, myOrders)
router.route("/sales/me").get(isAuthenticatedUser, sellerOrders)
router.route("/order/:id").put(isAuthenticatedUser, updateOrder)
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrders)

module.exports = router;