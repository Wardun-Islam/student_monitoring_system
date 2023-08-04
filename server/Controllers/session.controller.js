const jwt = require("jsonwebtoken");
const { createNodeRedisClient } = require("handy-redis");
const {
   redis_host,
   redis_port,
   redis_password,
   jwt_secret,
} = require("../config");

// Redis Database Setup
const redisClient = createNodeRedisClient({
   host: redis_host,
   port: Number(redis_port),
   password: redis_password,
});

redisClient.nodeRedis.on("error", (err) => console.error(err));

const create_token = (user_id) => {
   const jwtPayload = {
      user_id,
   };
   try {
      return Promise.resolve(
         jwt.sign(jwtPayload, jwt_secret, {
            expiresIn: "1d",
         })
      );
   } catch (error) {
      return Promise.reject(error);
   }
};

const verifyToken = (token) => {
   return redisClient
      .get(token)
      .then((user_id) => {
         var decoded_token = jwt.verify(token, jwt_secret);
         if (decoded_token && decoded_token.user_id === user_id) {
            return Promise.resolve({
               user_id: user_id,
            });
         } else
            return Promise.reject({
               session_verification: "successfull",
               error: {
                  ecode: 603,
                  details:
                     "The provided token is invalid or the token is expired.",
               },
            });
      })
      .catch((err) => {
         return Promise.reject({
            session_verification: "failed",
            error: {
               ecode: 604,
               details: "Failed to get token value from redis client.",
            },
         });
      });
};

const create_session = (user_id) => {
   if (user_id) {
      return create_token(user_id)
         .then((token) => {
            return redisClient
               .set(token, user_id)
               .then((value) => {
                  if (value === "OK") {
                     return Promise.resolve({
                        user_id: user_id,
                        token: token,
                     });
                  } else {
                     return Promise.reject({
                        session_creation: "failed",
                        error: {
                           ecode: 601,
                           details:
                              "Redis does not return OK, session is not get stored in redis.",
                        },
                     });
                  }
               })
               .catch((err) =>
                  Promise.reject({
                     session_creation: "failed",
                     error: {
                        ecode: 602,
                        details: "Failed to store session into redis database.",
                        err: err,
                     },
                  })
               );
         })
         .catch((error) => {
            return Promise.reject({
               session_creation: "failed",
               error: {
                  ecode: 701,
                  details: "Failed to create jwt token.",
               },
            });
         });
   } else {
      return Promise.reject({
         session_creation: "failed",
         error: {
            ecode: 104,
            details:
               "User id is missing, user id have to provide when called create_session function.",
         },
      });
   }
};

// const otherMethod = () => {
//    // your method logic
// };

module.exports = {
   create_session,
   verifyToken,
};
