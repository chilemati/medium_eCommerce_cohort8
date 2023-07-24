const express = require("express");
const { isValidObjectId } = require("mongoose");
const {
  createProduct,
  allProduct_get,
  deleteProduct,
  updateProduct_patch,
  prodLikes_get,
  singleProduct,
} = require("../controllers/productControllers");
const { get_test, get_home } = require("../controllers/routeControllers");
const {
  post_user,
  login_post,
  signOut_get,
  allUsers_get,
  update_user_post,
  Cart_get,
  createPin_post,
  verifyPin_post,
  allCart_get,
  remCart,
  remove_user_post,
} = require("../controllers/userControllers");
const { adminOnly } = require("../middlewares/adminOnly");
const { admin_subadmin_only } = require("../middlewares/admin_subadmin_only");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const upload = require("../utils/multer");
const route = express.Router();
// normal routes
route.get("/", isLoggedIn, get_home);
route.get("/hello", get_test);

//user routes
route.post("/createUser", post_user);
route.post("/login", login_post);
route.get("/signout", signOut_get);
route.get("/allUsers", isLoggedIn, adminOnly, allUsers_get);
route.post("/updateUser", isLoggedIn, adminOnly, update_user_post);
route.get("/cart/:id", isLoggedIn, Cart_get);
route.post(
  "/createPin",
  upload.single("prodImg"),
  isLoggedIn,
  admin_subadmin_only,
  createPin_post
);
route.post(
  "/verifyPin",
  upload.single("prodImg"),
  isLoggedIn,
  admin_subadmin_only,
  verifyPin_post
);
route.get("/allCart", allCart_get);
route.post("/remCart", remCart);
route.post("/removeUser", isLoggedIn, adminOnly, remove_user_post);

//product routes
route.post(
  "/createProduct",
  isLoggedIn,
  admin_subadmin_only,
  upload.single("prodImg"),
  createProduct
);
route.get("/allProducts", allProduct_get);
route.delete("/delete/:id", isLoggedIn, admin_subadmin_only, deleteProduct);
route.patch(
  "/updateProduct",
  upload.single("prodImg"),
  isLoggedIn,
  admin_subadmin_only,
  updateProduct_patch
);
route.get("/Likes/:id", isLoggedIn, prodLikes_get);
route.get("/product/:id", singleProduct); // /product/1

//! no route zone
route.get("*", (req, res) => {
  res.json({ err: "no such route" });
});
route.delete("*", (req, res) => {
  res.json({ err: "no such route" });
});
route.post("*", (req, res) => {
  res.json({ err: "no such route" });
});
route.patch("*", (req, res) => {
  res.json({ err: "no such route" });
});

module.exports = route;
