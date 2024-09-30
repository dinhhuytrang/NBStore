const express = require("express");
const bodyParser = require("body-parser");
const { AuthController } = require("../controllers/index.js");
const verifySignUp = require("../middlewares/verifySignUp");
const verifyJWT = require("../middlewares/verifyJWT.js");

const authRouter = express.Router();
authRouter.use(bodyParser.json());

//sign up
authRouter.post("/signup", [verifySignUp.checkExistRole, verifySignUp.checkExistUser], AuthController.signup);

//sign in
authRouter.post("/signin", AuthController.signin);
authRouter.post("/logout", verifyJWT.verifyToken, AuthController.logout);

//forgot/reset password
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.get("/reset-password", AuthController.resetPassword);
module.exports = authRouter;
