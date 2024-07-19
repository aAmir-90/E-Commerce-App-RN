import { token } from "morgan";
import { User } from "../models/userModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });
    res.status(201).send({
      success: true,
      message: "Registration User Success",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Register API Error",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // Check Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login Successfully",
        token,
        user,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Register API Error",
      error,
    });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User profile fetched",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Profile API Error",
      error,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "User Logout Successfully",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Logout API Error",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validate and update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Update Profile API Error",
      error,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide Old or New password",
      });
    }
    // check old password
    const isMatch = await user.comparePassword(oldPassword);
    // validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Update Password API Error",
      error,
    });
  }
};

// Update Profile Picture
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // file get from user/client photo
    const file = getDataUri(req.file);
    // delete prev img
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    // Update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save function
    await user.save();
    res.status(200).send({
      success: true,
      message: "Profile picture updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Update Profile Picture API Error",
      error,
    });
  }
};

// Forgot password controller
export const passwordResetController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(401).send({
        success: false,
        message: "Please Provide all fields",
      });
    }
    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid User or Answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your password has been reset successfully, Please Login!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Update Profile Picture API Error",
      error,
    });
  }
};
