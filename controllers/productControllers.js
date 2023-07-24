const { isValidObjectId } = require("mongoose");
const Product8 = require("../models/product");
const { handleErrors } = require("../services/handleErrors");
const { toCloud } = require("../utils/cloudinary");

exports.createProduct = async (req, res, next) => {
  let { prodPrice, prodName, prodSnippet, prodDetails } = req.body;
  if (req.file) {
    /*
     STEPS TO CREATE A PRODUCT:
      > UPLOAD IMAGE TO CLOUDINARY
      > EXTRACT THE ID AND URL
      > ADD THE ID AND URL TO THE OBJECT RECEIVED FROM REQ.BODY
      > SAVE TO MONGODB
    */

    toCloud.uploader
      .upload(req.file.path, {
        // UPLOAD TO CLOUDINARY
        folder: "Product8",
      })
      .then((rep) => {
        // extract id and url
        let prodImg_url = rep.secure_url;
        let prodImg_id = rep.public_id;
        let toDb = {
          // adding to upload object
          prodDetails,
          prodPrice,
          prodSnippet,
          prodName,
          prodImg_id,
          prodImg_url,
        };
        // save to db
        let toCreate = new Product8(toDb);
        toCreate
          .save()
          .then((rep1) => {
            res.json({ status: true, data: "" });
          })
          .catch(async (err) => {
            await toCloud.uploader.destroy(rep.public_id);
            res.json({
              err: handleErrors(err),
              // err: err,
            });
          });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  } else {
    res.json({ err: { img: "Please provide a product image" } });
  }
  // res.json({ data: req.body, file: req.file });
};

exports.allProduct_get = (req, res) => {
  Product8.find()
    .sort({ createdAt: -1 })
    .then((rep) => {
      res.json({ status: true, data: rep });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};

exports.singleProduct = (req, res) => {
  let { id } = req.params;
  if (isValidObjectId(id)) {
    Product8.findById(id)
      .then((rep) => {
        res.json({ status: true, data: rep });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  } else {
    res.json({ err: "no such product" });
  }
};

exports.deleteProduct = (req, res) => {
  /* 
   STEPS TO DELETE A PRODUCT: 
   > GET THE PRODUCT FROM DB USING THE ID
   > DELETE THE IMAGE FORM CLOUINARY
   > DELETE FORM DB
  */

  let { id } = req.params;
  if (isValidObjectId(id)) {
    Product8.findById({ _id: id }).then(async (rep) => {
      // let rem = await toCloud.uploader.destroy(rep.prodImg_id);

      toCloud.uploader
        .destroy(rep.prodImg_id)
        .then((rem) => {
          // if (rem.result === "ok") {
          Product8.findByIdAndDelete({ _id: id })
            .then((rep1) => {
              res.json({
                status: true,
                data: rep1,
              });
            })
            .catch((err) => {
              res.json({ err: err.message });
            });
          // }
        })
        .catch((err) => {
          res.json({ online: true });
        });
    });
  } else {
    res.json({ err: `${id} is not a valid product id` });
  }
};

exports.updateProduct_patch = async (req, res) => {
  /* 
   STEP TO UPDATE A PRODUCT: 
   > CHECK IF THE UPDATE HAS A FILE
   > IF FILE: 
     > USE THE ID TO GET THE PRODUCT
     > DELETE FROM CLOUDINARY
     > UPLOAD TO CLOUDINARY
     > add id and url toDb object
     > UPDATE DB
    > IF NO FILE: 
      > FIND BY ID AND UPDATE
  */
  let { prodDetails, prodName, prodPrice, prodSnippet, id } = req.body;
  let toDb = {};
  if (prodName != undefined) {
    toDb.prodName = prodName;
  }
  if (prodPrice != undefined) {
    toDb.prodPrice = prodPrice;
  }
  if (prodDetails != undefined) {
    prodSnippet;
    toDb.prodDetails = prodDetails;
  }
  if (prodSnippet != undefined) {
    toDb.prodSnippet = prodSnippet;
  }

  if (req.file) {
    // get product
    let prod = await Product8.findById(id);
    // > DELETE FROM CLOUDINARY
    toCloud.uploader
      .destroy(prod.prodImg_id)
      .then((rem) => {
        //  > UPLOAD TO CLOUDINARY
        toCloud.uploader
          .upload(req.file.path, {
            folder: "Product8",
          })
          .then((upd) => {
            //  > add id and url toDb object
            toDb.prodImg_id = upd.public_id;
            toDb.prodImg_url = upd.secure_url;
            //  > UPDATE DB
            Product8.findByIdAndUpdate({ _id: id }, { $set: toDb })
              .then((db) => {
                res.json({ status: true, data: "" });
              })
              .catch((err) => {
                res.json({ err: err });
              });
          })
          .catch((err2) => {
            res.json({ err: err2 });
          });
      })
      .catch((err1) => {
        res.json({ err: err1 });
      });
  } else {
    Product8.findByIdAndUpdate({ _id: id }, { $set: toDb })
      .then((rep) => {
        res.json({ status: true, data: "" });
      })
      .catch((err) => {
        res.json({ err: err });
      });
  }
};

exports.prodLikes_get = (req, res) => {
  let { id } = req.params;
  if (isValidObjectId(id)) {
    Product8.findByIdAndUpdate({ _id: id }, { $inc: { prodLikes: 1 } })
      .then((rep) => {
        res.json({ status: true, data: rep });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  } else {
    res.json({ err: "No such product" });
  }
};
