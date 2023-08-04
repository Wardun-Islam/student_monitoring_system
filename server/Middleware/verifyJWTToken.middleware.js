const { getUserFromUserId } = require("../Controllers/query.controller");
const { verifyToken } = require("../Controllers/session.controller");

module.exports = function (req, res, next) {
  const { jwt_token } = req.headers;
  if (jwt_token) {
    verifyToken(jwt_token)
      .then((user) => {
        const user_id = user.user_id;
        getUserFromUserId(user_id)
          .then((data) => {
            if (data[0] != null) {
              req.authorized_user = data[0];
              next();
            } else {
              req.authorized_user_error = {
                authorization: "failed",
                error: {
                  ecode: 1000,
                  details:
                    "Failed to get user from database using provided jwt token's user id.",
                },
              };
              next();
            }
          })
          .catch((error) => {
            req.authorized_user_error = error;
            next();
          });
      })
      .catch((error) => {
        req.authorized_user_error = error;
        next();
      });
  } else {
    req.authorized_user_error = {
      authorization: "failed",
      error: {
        ecode: 111,
        details: "Failed to get jwt token in request header.",
      },
    };
    next();
  }
};
