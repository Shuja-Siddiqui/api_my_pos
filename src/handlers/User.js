const Response = require("./Response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models");

class User extends Response {
  // Create User
  createProfile = async (req, res) => {
    try {
      const { userName, email, password, role, phoneNo } = req.body;

      // Check if email already exists
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Email already in use",
          status: 400,
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        role,
        phoneNo,
      });

      await newUser.save();

      // Optionally, generate a token upon registration
      // const token = jwt.sign(
      //   { id: newUser._id, email: newUser.email, role: newUser.role },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "1h" }
      // );

      return this.sendResponse(req, res, {
        data: {
          userId: newUser._id,
          userName: newUser.userName,
          email: newUser.email,
        },
        message: "User added successfully",
        status: 201,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "User not added!",
        status: 500,
      });
    }
  };

  // Get All Users
  getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.find().select("-password"); // Exclude password
      return this.sendResponse(req, res, {
        data: users,
        message: "Users retrieved successfully",
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve users",
        status: 500,
      });
    }
  };

  // Get Single User by ID
  getUserById = async (req, res) => {
    try {
      const userId = req.params.user_id;

      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        return this.sendResponse(req, res, {
          data: null,
          message: "User not found",
          status: 404,
        });
      }

      return this.sendResponse(req, res, {
        data: user,
        message: "User retrieved successfully",
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to retrieve user",
        status: 500,
      });
    }
  };

  // Update User
  updateUser = async (req, res) => {
    try {
      const userId = req.params.user_id;
      const updatedData = req.body;

      // If password is being updated, hash it
      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return this.sendResponse(req, res, {
          data: null,
          message: "User not found",
          status: 404,
        });
      }
      // Prevent updating email to an already existing one
      if (updatedData.email && updatedData.email !== user.email) {
        const emailExists = await UserModel.findOne({
          email: updatedData.email,
        });
        if (emailExists) {
          return this.sendResponse(req, res, {
            data: null,
            message: "Email already in use",
            status: 400,
          });
        }
      }
      await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: updatedData?.updatedData },
        { new: true }
      );
      const updatedUser = await UserModel.findById(userId).select("-password");
      return this.sendResponse(req, res, {
        data: updatedUser,
        message: "User updated successfully",
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to update user",
        status: 500,
      });
    }
  };

  // Delete User
  deleteUser = async (req, res) => {
    try {
      const userId = req.params.user_id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return this.sendResponse(req, res, {
          data: null,
          message: "User not found",
          status: 404,
        });
      }

      await UserModel.deleteOne({ _id: userId });

      return this.sendResponse(req, res, {
        data: null,
        message: "User removed successfully",
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "Failed to delete user",
        status: 500,
      });
    }
  };

  // User Login
  login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      // Validate input
      if (!email || !password || !role) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Email and password are required",
          status: 400,
        });
      }

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Invalid email or password",
          status: 401,
        });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Invalid email or password",
          status: 401,
        });
      }
      const isRole = user.role === role;
      if (!isRole) {
        return this.sendResponse(req, res, {
          data: null,
          message: "Invalid email or password",
          status: 401,
        });
      }
      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return this.sendResponse(req, res, {
        data: { token, user },
        message: "Login successful",
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        data: null,
        message: "Login failed",
        status: 500,
      });
    }
  };
}
module.exports = {
  User,
};
