const router = require("express").Router();
const bookRoutes = require("./books");
const searchRoute = require("./googleSearch");

// Book routes
router.use("/books", bookRoutes);
// API route
router.use("/search", searchRoute);

module.exports = router;
