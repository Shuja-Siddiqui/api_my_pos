const jwt = require("jsonwebtoken");
const Response = require("../handlers/Response");

const responseHandler = new Response();

const refreshAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader === "undefined") {
    return responseHandler.sendResponse(req, res, {
      data: null,
      message: "Authorization header missing",
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err && err.name === "TokenExpiredError") {
      // Token has expired, attempt to refresh
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return responseHandler.sendResponse(req, res, {
          data: null,
          message: "Refresh token missing",
          status: 401,
        });
      }

      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
          return responseHandler.sendResponse(req, res, {
            data: null,
            message: "Invalid or expired refresh token",
            status: 401,
          });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
          { id: user.id },
          process.env.SECRET_KEY,
          {
            expiresIn: "15m",
          }
        );

        const newRefreshToken = jwt.sign(
          { id: user.id },
          process.env.REFRESH_SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = user;

        next();
      });
    } else if (err) {
      // Other token errors
      return responseHandler.sendResponse(req, res, {
        data: null,
        message: "Invalid token",
        status: 401,
      });
    } else {
      // Token is valid
      req.user = user;
      next();
    }
  });
};

module.exports = refreshAuth;
