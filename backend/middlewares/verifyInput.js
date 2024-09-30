const createHttpError = require("http-errors");
const db = require("../models");

const User = db.user;
const Role = db.role;

/**
 * Function ở đây là bước tiền kiểm tra trước khi đi vào trong controller
 */

async function checkExistUser(req, res, next) {
  try {
    if (!req.body.email || !req.body.password || !req.body.name) {
      throw createHttpError.BadRequest("Missing email, password or name");
    }
    if (await User.findOne({ email: req.body.email })) {
      throw createHttpError.BadRequest(`${req.body.email} is already registered`);
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function checkExistRole(req, res, next) {
  try {
    if (req.body.role) {
      const role = await Role.findOne({ name: req.body.role }).exec();
      if (!role) throw createHttpError.BadRequest("Role not found");
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function verifySignIn(req, res, next) {
  //check status of user
}

module.exports = {
  checkExistUser,
  checkExistRole,
};
