const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const Cart = db.cart;
//gọi ra các đối tượng từ db
const User = db.user;
const Role = db.role;

//generate access token : chứa thông tin user trả về, muốn nó trả về cái gì thì thêm vào object
//thiếu hạn sử dụng, nếu không thì nó sẽ mặc định là 15 phút :       expiresIn: "15m",
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "15m",
    },
  );
}

// Generate refresh token
async function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });

  user.refreshToken = token;
  await user.save();

  return token;
}

// Request refresh token
async function requestRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "You're not Authenticated." });

    const foundUser = await User.findOne({ refreshToken }).populate("role").exec();
    if (!foundUser) return res.status(403).json({ message: "Refresh token is not valid" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
      if (err) return res.status(403).json({ message: "Refresh token is not valid" });

      const newAccessToken = generateAccessToken(foundUser);
      const newRefreshToken = await generateRefreshToken(foundUser);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        path: "/",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//sign up action
async function signup(req, res, next) {
  try {
    if (req.body) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      if (req.body.role) {
        const roleFound = req.body.role;
        const roleFoundInDB = await Role.findOne({ name: roleFound }).exec();
        newUser.role = roleFoundInDB._id;
      } else {
        const defaultRole = await Role.findOne({ name: "user" }).exec();
        newUser.role = defaultRole._id;
      }

      const saveUser = await newUser.save();

      //send mail notify user
      // const mailOptions = {
      //   from: '"HolaWear" <vanminhtuan2003@gmail.com>',
      //   to: newUser.email,
      //   subject: "Welcome to HolaWear",
      //   html: `
      //     <p style="color: green; font-size: 30px">WELCOME <strong>${newUser.name}</strong> to HolaWear
      //     <a href="http://localhost:5173/">(holawear.com)</a>
      //     </p>
      //     <p>You have successfully registered an account on HolaWear. Enjoy shopping with us!</p>
      //   `,
      // };

      // await transporter.sendMail(mailOptions);

      //create cart
      if (saveUser) {
        const userId = newUser._id.toString();
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "Email and User not found." });
        }
        const newCart = new Cart({ userId, cartItems: [], totalPrice: 0 });
        await newCart.save();
        res.status(201).json({ message: "ok" });
      }
    }
  } catch (error) {
    next(error);
  }
}

// Sign in action
async function signin(req, res, next) {
  try {
    const { email, password, productSelection } = req.body;

    const user = await User.findOne({ email }).populate("role").exec();
    if (!user) return res.status(404).json({ message: "Email and User not found." });

    //validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Wrong password" });

    //check status account
    if (user.status === false) {
      console.log("Account is locked by system");
      //send mail notify user
      return res.status(401).json({ message: "Your account is locked by system." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      path: "/",
    });

    const responsePayload = {
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        phone: user.phone,
        gender: user.gender,
        shippingAddress: user.shippingAddress,
      },
    };

    // Include productSelection in the response payload if available
    if (productSelection == null) {
      responsePayload.productSelection = productSelection;
    }

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
}

//log out
async function logout(req, res, next) {
  try {
    // Decode access token to get user ID
    const token = req.headers.token.split(" ")[1];
    const payload = jwt.decode(token);
    const userId = payload.id;

    // Update refresh token of user to null
    await User.findByIdAndUpdate(userId, { refreshToken: null }).exec();

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    // Send success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "vanminhtuan2003@gmail.com",
    pass: "zubo aayv abtz kwsb",
  },
});

//forgot password
async function forgotPassword(req, res) {
  // Find the user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Generate a password reset token and set its expiration date
  const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1h" });
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send the password reset email
  const resetUrl = `http://${req.headers.host}/api/auth/reset-password?token=${token}`;
  const mailOptions = {
    from: '"HolaWear" <vanminhtuan2003@gmail.com>',
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
}

//generate random password
function generateRandomPassword() {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+-=[]{}|;:,.<>?";
  let randomPassword = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomPassword += charset[randomIndex];
  }

  return randomPassword;
}

async function resetPassword(req, res) {
  // Validate the password reset token
  const token = req.query.token;
  const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);

  // Find the user by their ID and token, and check if the token is still valid
  const user = await User.findOne({
    _id: decodedToken.id,
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid or expired password reset token" });
  }

  // Update the user's password and remove the reset token and its expiration date
  const salt = await bcrypt.genSalt(10);

  const newPassword = generateRandomPassword();
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send a confirmation email
  const mailOptions = {
    from: '"HolaWear" <vanminhtuan2003@gmail.com>',
    to: user.email,
    subject: "Password Reset Confirmation",
    html: `
      <h1 style="color: green">RESET PASSWORD in HolaWear 
      <a href="http://localhost:5173/">(holawear.com)</a>
      </h1>
      <p>Your password has been successfully reset. Your new password is:</p>
      <p style="font-size: 30px"><strong>${newPassword}</strong></p>
      <p>If you did not initiate this request, please contact us immediately.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Redirect the user to the success page instead of returning a JSON response
    res.redirect("http://localhost:5173/templates/reset-password-success.html");
  } catch (err) {
    console.log(err);
    console.error("Failed to send password reset confirmation email:", err);
    res.status(500).json({ error: "Failed to send password reset confirmation email" });
  }
}

module.exports = {
  signup,
  signin,
  logout,
  requestRefreshToken,
  forgotPassword,
  resetPassword,
};
