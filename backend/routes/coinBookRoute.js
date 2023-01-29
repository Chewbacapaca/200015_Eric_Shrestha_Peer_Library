const express = require("express");
const {createCoinBook, getAllCoinBooks, updateCoinBook, deleteCoinBook, getCoinBookDetails, getUserCoinBooks, getAdminCoinBooks} = require("../controllers/coinBookController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router()

router.route("/coinBook/new").post(isAuthenticatedUser, createCoinBook)

router.route("/coinBooks").get(getAllCoinBooks)

router.route("/admin/coinBooks").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminCoinBooks)


router
    .route("/coinBook/:id")
    .put(isAuthenticatedUser, updateCoinBook)
    .delete(isAuthenticatedUser, deleteCoinBook)
    
router.route("/coinBook/:id").get(getCoinBookDetails)

router.route("/me/coinBooks").get(isAuthenticatedUser, getUserCoinBooks)


module.exports = router