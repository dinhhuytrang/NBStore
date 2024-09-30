const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcrypt");
// Create a user role seller / admin - for admin only
async function create(req, res, next) {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
      role: req.body.role,
    });
    await newUser
      .save()
      .then((newDoc) => {
        res.status(201).json(newDoc);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

// Get all users
async function getAllUsers(req, res, next) {
  //get all users + change their role to role name
  try {
    const users = await User.find();
    const usersWithRole = await Promise.all(
      users.map(async (user) => {
        const getRole = await Role.findById(user.role);
        const roleName = getRole.name;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone ? user.phone : "Not provided",
          role: roleName,
          shippingAddress: user.shippingAddress?.length > 0 ? user.shippingAddress : "Not provided",
          status: user.status,
        };
      }),
    );
    res.status(200).json(usersWithRole);
  } catch (error) {
    next(error);
  }
}

// Update a user by user ID - update general : name - email - phone - gender
async function updateGeneralUserById(req, res, next) {
  try {
    //get input + find user + find role by user role id
    const userId = req.params.id;
    const { name, email, phone, gender } = req.body;
    const userFound = await User.findById(userId);
    const getRole = await Role.findById(userFound.role);
    const roleName = getRole.name;

    //email , name cannot be null
    if (!email || !name) {
      throw new Error("Email and name cannot be null!");
    }

    if (userFound != null) {
      userFound.name = name ? name : userFound.name;
      userFound.email = email ? email : userFound.email;
      userFound.phone = phone ? phone : userFound.phone;
      userFound.gender = gender ? gender : userFound.gender;

      var dataBack = await userFound.save();
      if (dataBack) {
        res.status(201).json({
          id: dataBack._id,
          name: dataBack.name,
          email: dataBack.email,
          phone: dataBack.phone,
          gender: dataBack.gender,
          role: roleName,
          shippingAddress: dataBack.shippingAddress,
        });
      } else {
        throw new Error("Update general user failed");
      }
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
}
async function updateStatuslUserById(req, res, next) {
  try {
    //get input + find user + find role by user role id
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound != null) {
      userFound.status = !userFound.status;

      var dataBack = await userFound.save();
      if (dataBack) {
        res.status(200).json({
          userFound,
        });
      } else {
        throw new Error("Update status user failed");
      }
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
}

// Get user by email
async function getUserByEmail(req, res, next) {
  try {
    const email = req.params.email;
    await User.findOne({ email: email })
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const id = req.params.id;
    await User.findOne({ _id: id })
      .populate("role", "name")
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}
//Add shipping address by user ID
//return shipping address(array) after adding
async function addShippingAddress(req, res, next) {
  try {
    const userId = req.params.id;

    const address = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      specificAddress: req.body.specificAddress,
    };

    //tìm + thêm address vào mảng shippingAddress
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { shippingAddress: address } }, { new: true, runValidators: true });
    const getRole = await Role.findById(updatedUser.role);
    const roleName = getRole.name;

    if (updatedUser) {
      res.status(201).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        role: roleName,
        shippingAddress: updatedUser.shippingAddress,
      });
    } else {
      throw new Error("Add shipping address failed");
    }
  } catch (error) {
    next(error);
  }
}

async function deleteShippingAddress(req, res, next) {
  try {
    const userId = req.params.id;
    const addressId = req.query.addressId;

    // Find the user by ID and pull the address with the given ID from the shippingAddress array
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { shippingAddress: { _id: addressId } } }, { new: true, runValidators: true });

    const getRole = await Role.findById(updatedUser.role);
    const roleName = getRole.name;

    if (updatedUser) {
      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        role: roleName,
        shippingAddress: updatedUser.shippingAddress,
      });
    } else {
      throw new Error("Delete shipping address failed");
    }
  } catch (error) {
    next(error);
  }
}

// Change password
async function changePassword(req, res, next) {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const userFound = await User.findById(userId);
    if (!userFound) {
      throw new Error("User not found");
    }

    // Check if current password is correct
    const validPassword = await bcrypt.compare(currentPassword, userFound.password);
    if (!validPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    userFound.password = hashedPassword;
    const result = await userFound.save();

    if (result) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      throw new Error("Change password failed");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getUserByEmail,
  addShippingAddress,
  deleteShippingAddress,
  updateGeneralUserById,
  changePassword,
  getAllUsers,
  getUserById,
  updateStatuslUserById,
};
