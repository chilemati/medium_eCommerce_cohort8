const mongoose = require("mongoose");
const { hashIt } = require("../services/hashIt");
let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email address"],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minLength: [8, "password lenght must be more than 8 characters"],
    },
    role: {
      type: String,
      required: false,
      default: "normal",
    },
    cart: [String],
    pin: {
      type: String,
      required: false,
      minlength: [6, "Pin must be greater than 6 digits"],
    },
  },
  { timestamps: true }
);
//? hooks starts here
userSchema.pre("save", async function () {
  this.password = await hashIt(this.password);
});

//? use hooks before here
const User8 = mongoose.model("User8", userSchema);

module.exports = User8;
