const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  port: process.env.PORT,
  user_photo_initial_upload_path: __dirname + "/public/photo/",
  user_photo_initial_link: "http://localhost:" + process.env.PORT + "/photo/",
  assignment_photo_initial_upload_path: __dirname + "/public/photo/assignments/",
  assignment_photo_initial_link:
    "http://localhost:" + process.env.PORT + "/photo/assignments/",
  pdf_initial_upload_path: __dirname + "/public/pdf/",
  pdf_initial_link: "http://localhost:" + process.env.PORT + "/pdf/",
  db_client: process.env.DB_CLINT,
  db_connection: process.env.DB_CONNECTION,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_password: process.env.REDIS_PASSWORD,
  jwt_secret: process.env.JWT_SECRET_KEY,
};
