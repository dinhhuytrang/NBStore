//kiểm soát access token, trước khi đến controller
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function verifyToken(req, res, next) {
  //get token from header of user

  //forbidden - ngăn cấm -> token het han
  // return res.status(403).json({
  //   message: "Token is not valid. Forbidden!",
  // });

  //decode access token -> id user
  //id user -> lấy ra refresh token của user -> check token này còn hạn k
  //check id vs token ok -> call function refreshToken
  //-> trả về access token mới

  //1. check refresh token in db hết hạn chưa
  //rồi -> gửi mes về cho fe để bắt user log out
  //chưa -> check access token hết hạn chưa ...
  const token = req.headers.token;
  const userIdFE = req.body.userId;
  const userFound = await User.findById(userIdFE).populate("role").exec();
  const refreshToken = userFound.refreshToken;
  // console.log("refreshToken: " + refreshToken);

  //2 ways to get token from user - cookie or header(đ dc) / db => 1 cách đó là lấy id user từ FE xong tìm token trong db
  if (refreshToken == null) console.log("refreshToken is null");

  const refreshTokenDecoded = jwt.decode(refreshToken);
  let date = new Date();
  //nếu refreshToken hết hạn
  if (refreshTokenDecoded.exp < date.getTime() / 1000) {
    return res.status(403).json({
      message: "Refresh token is not valid. Must log in again!",
    });
  }

  //nếu có access token gửi xuống
  if (token) {
    const secretToken = token.split(" ")[1];
    const secretRefreshToken = refreshToken;

    // console.log("===== secretRefreshToken: " + secretRefreshToken);
    // console.log("===== secretToken: " + secretToken);

    jwt.verify(secretToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
      if (err) {
        const payloadAccessToken = jwt.decode(secretToken);
        const payloadRefreshToken = jwt.decode(secretRefreshToken);

        const userIdAccessToken = payloadAccessToken.id;
        const userIdRefreshToken = payloadRefreshToken.id;

        if (userIdRefreshToken !== userIdAccessToken) {
          return res.status(403).json("You are not authorized");
        }

        const newAccessToken = await refreshAccessToken(userIdAccessToken);
        // console.log("=== newAccessToken: " + newAccessToken);
        res.setHeader("token", `Bearer ${newAccessToken}`);

        req.user = jwt.decode(newAccessToken); // Decode new token to get user info
        next();
      } else {
        // console.log("no error");
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not authorized");
  }
}

// Helper function to refresh access token
async function refreshAccessToken(userId) {
  try {
    const user = await User.findById(userId).populate("role").exec();
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(user);
    return newAccessToken;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Helper function to generate new access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "15m" },
  );
}

//just admin and its user can access
async function verifyTokenIsUserAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.roles) {
      next();
    } else {
      return res.status(403).json("You are not allowed to do that. Must be admin or do it with your correct id.");
    }
  });
}

//just admin can access
async function verifyTokenIsAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role.name === "admin") {
      next();
    } else {
      return res.status(403).json("You are not allowed to do that. Must be admin.");
    }
  });
}

//check time of token = get token from session storage
// async function

module.exports = {
  verifyToken,
  verifyTokenIsUserAndAdmin,
  verifyTokenIsAdmin,
};
