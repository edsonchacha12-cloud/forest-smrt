const { errorResponse } = require("../utils/response");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden: insufficient role", 403);
    }

    next();
  };
};

module.exports = roleMiddleware;