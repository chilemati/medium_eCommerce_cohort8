const { isValidObjectId } = require("mongoose");
const Product8 = require("../models/product");
const User8 = require("../models/user");
const { compareIt } = require("../services/compareIt");
const { createCookie } = require("../services/createCookie");
const { getToken } = require("../services/getToken");
const { handleErrors } = require("../services/handleErrors");
const { hashIt } = require("../services/hashIt");
const { verifyToken } = require("../services/verifyToken");

let expIn = 1000 * 60 * 60;
exports.post_user = async (req, res) => {
  let { email, password } = req.body;
  let users = await User8.find();
  let toUpd = {
    email,
    password,
    role: users.length === 0 ? "admin" : "normal",
  };
  let db = new User8(toUpd);
  //if length of all users === 0, then role:admin

  db.save()
    .then(async (rep) => {
      let token = await getToken({ email: rep.email, role: rep.role }, expIn);
      createCookie(res, token, expIn);
      // res.json(rep);
      res.json({
        status: true,
        user: rep.email,
        role: rep.role,
        cart: rep.cart.length,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.json({ err: handleErrors(err) });
    });
};
exports.login_post = async (req, res) => {
  let { email, password } = req.body;
  //? check if a user exist with this email
  //? if user, compare password with the hashed one from db
  //? if true password, create token and allow
  let isEmail = await User8.findOne({ email });
  if (isEmail) {
    let isPassword = await compareIt(password, isEmail.password);
    if (isPassword) {
      let token = await getToken(
        { email: isEmail.email, role: isEmail.role },
        expIn
      );
      // createCookie(res, token, expIn);
      res.cookie("jwt", token, { maxAge: 60 * 60 * 1000, httpOnly: true });
      res.json({
        status: true,
        user: isEmail.email,
        role: isEmail.role,
        cart: isEmail.cart.length,
      });
    } else {
      res.json({ err: "wrong email or password" });
    }
  } else {
    res.json({ err: "wrong email or password" });
  }
};

exports.signOut_get = (req, res) => {
  createCookie(res, "", 1);
  res.json({ status: "Your are signed out!" });
};
exports.allUsers_get = (req, res) => {
  User8.find({}, { email: 1, role: 1 })
    .then((rep) => {
      res.json({ status: true, data: rep });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};
exports.update_user_post = (req, res) => {
  let { id, role } = req.body;
  User8.findByIdAndUpdate(id, { $set: { role } })
    .then((rep) => {
      res.json({ status: true, data: rep });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};
exports.remove_user_post = (req, res) => {
  let { id } = req.body;
  // res.json({ id: id });
  if (isValidObjectId(id)) {
    User8.findByIdAndDelete(id)
      .then((rep) => {
        res.json({ status: true, data: "" });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  } else {
    res.json({ err: "User not found" });
  }
};

exports.Cart_get = async (req, res) => {
  let { id } = req.params;
  if (isValidObjectId(id)) {
    let verified = await verifyToken(req.cookies.jwt); // get user email
    let user = await User8.findOne({ email: verified.email }); // get user id using email
    User8.findByIdAndUpdate(
      { _id: user._id },
      { $addToSet: { cart: id } },
      // { returnDocument: 'after' }
      { returnOriginal: false }
    )

      .then((rep) => {
        res.json({ status: true, cart: rep.cart });
      })
      .catch((err) => {
        res.json(err.message);
      });
  } else {
    res.json({ err: "product not found" });
  }
};

exports.allCart_get = async (req, res) => {
  // check if logged in, get the email
  // get the user cart
  // find all the products in the user cart and return
  if (req.cookies.jwt) {
    let verified = await verifyToken(req.cookies.jwt); // get user email
    let user = await User8.findOne({ email: verified.email }); // get user id using email
    // res.json(...user.cart);
    Product8.find({ _id: user.cart })
      .then((rep) => {
        res.json({ status: true, data: rep, rep });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  } else {
    res.json({ err: "Please login " });
  }
};

exports.remCart = async (req, res) => {
  // check if logged in, get the email
  // get the user cart
  // remove product id from user cart and return ok
  let { id } = req.body;
  if (req.cookies.jwt) {
    let verified = await verifyToken(req.cookies.jwt); // get user email
    let user = await User8.findOne({ email: verified.email }); // get user
    if (isValidObjectId(id)) {
      User8.findByIdAndUpdate(
        { _id: user._id },
        { $pull: { cart: { $in: id } } },
        { returnOriginal: false }
      )
        .then((rep) => {
          res.json({ status: true, data: rep.cart });
        })
        .catch((err) => {
          res.json({ err: err.message });
        });
    } else {
      res.json({ err: "No such product" });
    }
  } else {
    res.json({ err: "please Login" });
  }
};

exports.createPin_post = async (req, res) => {
  let { pin } = req.body;
  let hPin = await hashIt(pin); // hash pin
  let verified = await verifyToken(req.cookies.jwt); //get email from token
  let user = await User8.findOne({ email: verified.email }); // get id from email
  User8.findByIdAndUpdate({ _id: user._id }, { $set: { pin: hPin } }) // updating
    .then((rep) => {
      res.json({ status: true, data: "" });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};
exports.verifyPin_post = async (req, res) => {
  let { pin } = req.body;
  // let verified = await verifyToken(req.cookies.jwt); //get email from token
  // let user = await User8.findOne({ email: verified.email }); // get id
  // let verifiedPin = await compareIt(pin, user.pin);
  verifyToken(req.cookies.jwt)
    .then((verified) => {
      User8.findOne({ email: verified.email })
        .then(async (user) => {
          if (user.pin !== undefined) {
            // if user pin exist
            let verifiedPin = await compareIt(pin, user.pin);

            if (verifiedPin === true) {
              res.json({ status: true, data: "" });
            } else {
              res.json({ err: "Your pin no correct" });
            }
          } else {
            // if no user pin and redirects to create pin the the frontend
            res.json({ noPin: "Please create a pin" });
          }
        })
        .catch((err) => {
          res.json({ online: true, err: err.message });
        });
    })
    .catch((err) => {
      res.json({ online: true, err: err.message });
    });
};
