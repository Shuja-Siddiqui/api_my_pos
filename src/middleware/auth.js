const jwt = require("jsonwebtoken");
const Response = require("../handlers/Response");

const responseHandler = new Response();

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader === "undefined") {
      return responseHandler.sendResponse(req, res, {
        data: null,
        message: "Authorization header missing",
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return responseHandler.sendResponse(req, res, {
        data: null,
        message: "Token missing",
        status: 401,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    return responseHandler.sendResponse(req, res, {
      data: null,
      message: "Invalid or expired token",
      status: 401,
    });
  }
};

module.exports = auth;
