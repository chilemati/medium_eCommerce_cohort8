const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    prodName: {
      required: [true, "please provide a product name"],
      type: String,
    },
    prodPrice: {
      required: [true, "please provide a product price"],
      type: Number,
    },
    prodImg_url: {
      required: [true, "please provide a product image"],
      type: String,
    },
    prodImg_id: {
      required: [true, "please provide a product image id"],
      type: String,
    },
    prodSnippet: {
      required: [true, "please provide a product snippet"],
      type: String,
    },
    prodLikes: {
      required: false,
      type: Number,
      default: 0,
    },
    prodDetails: {
      required: [true, "please provide a product details"],
      type: String,
    },
  },
  { timestamps: true }
);

const Product8 = mongoose.model("Product8", productSchema);
module.exports = Product8;
