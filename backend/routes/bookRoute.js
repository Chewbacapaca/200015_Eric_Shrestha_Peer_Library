const express = require("express");
const { getAllBooks, createBook, updateBook, deleteBook, getBookDetails, getUserBooks, askQuestion, getAdminBooks } = require("../controllers/bookController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router()

router.route("/books").get(getAllBooks)

router.route("/me/books").get(isAuthenticatedUser, getUserBooks)

router.route("/admin/books").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminBooks)

router.route("/book/new").post(isAuthenticatedUser, createBook)

router
    .route("/book/:id")
    .put(isAuthenticatedUser, updateBook)
    .delete(isAuthenticatedUser, deleteBook)

router.route("/book/:id").get(getBookDetails)

router.route("/question").put(isAuthenticatedUser, askQuestion)

module.exports = router

//  authorizeRoles("admin")