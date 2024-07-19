import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is require"],
    },
    email: {
      type: String,
      required: [true, "email is require"],
      unique: [true, "email is already taken"],
    },
    password: {
      type: String,
      required: [true, "password is require"],
      minLength: [6, "password length should be greaster than 6 characters"],
    },
    address: {
      type: String,
      required: [true, "address is require"],
    },
    city: {
      type: String,
      required: [true, "city is require"],
    },
    country: {
      type: String,
      required: [true, "country is require"],
    },
    phone: {
      type: String,
      required: [true, "phone is require"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "answer is require"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash Function
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Function
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const User = mongoose.model("User", userSchema);
