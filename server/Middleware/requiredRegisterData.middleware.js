const { v4: uuidv4 } = require("uuid");
const {
    user_photo_initial_upload_path,
    user_photo_initial_link,
} = require("../config");
const bcrypt = require("bcryptjs");
const requestify = require("requestify");

module.exports = function (req, res, next) {
    if (req.body.google_token) {
        if (
            req.body.account_type &&
            (req.body.account_type === "student" ||
                req.body.account_type === "teacher")
        ) {
            requestify
                .get(
                    "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
                        req.body.google_token
                )
                .then(function (response) {
                    const first_name = response.getBody().given_name;
                    const last_name = response.getBody().family_name;
                    const email = response.getBody().email;
                    const user_image = response.getBody().picture;
                    const id = uuidv4();
                    req.user = {
                        user_id: id,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password_hash: null,
                        account_type: req.body.account_type,
                        joined_date: new Date(),
                        user_image: user_image,
                    };
                    next();
                })
                .catch((error) => {
                    return res.status(400).json({
                        registration_status: "failed",
                        error: {
                            ecode: 801,
                            details:
                                "Failed to get information using provided google token.",
                            err: error,
                        },
                    });
                });
        } else {
            return res.status(400).json({
                registration_status: "failed",
                error: {
                    ecode: 106,
                    details:
                        "All required data is not provided through request for register new google user.",
                },
            });
        }
    } else {
        //Getting data from request body
        const {
            first_name,
            last_name,
            email,
            password,
            retyped_password,
            account_type,
        } = req.body;
        //Getting photo file from request body if provided
        var user_image = null;
        console.log(req.body);
        if (req.files) {
            user_image = req.files.user_image;
        }
        //Checking required data for registration is provided or not
        if (
            !first_name ||
            !last_name ||
            !email ||
            !password ||
            !retyped_password ||
            !account_type
        ) {
            return res.status(400).json({
                registration_status: "failed",
                error: {
                    ecode: 101,
                    details:
                        "All required data is not provided through request for register new user.",
                },
            });
        }
        //Checking required data for registration is in correct format or not
        if (
          !first_name.match(/^[a-zA-Z ]{2,30}$/) ||
          !last_name.match(/^[a-zA-Z ]{2,30}$/) ||
          !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ||
          !password.match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/i
          ) ||
          password !== retyped_password ||
          (account_type !== "student" && account_type !== "teacher") ||
          (account_type !== "Student" && account_type !== "Teacher")
        ) {
          return res.status(400).json({
            registration_status: "failed",
            error: {
              ecode: 102,
              details:
                "All required data provided through request is not matched with the required format for register new user (can be password mismatch also).",
            },
          });
        }

        //Checking if account type is student then it has user image or not
        if (account_type === "student" && user_image === null) {
            return res.status(400).json({
                registration_status: "failed",
                error: {
                    ecode: 103,
                    details:
                        "For creating account of type student image is required but image is not provided through request.",
                },
            });
        }

        //Creating id and password hash
        const id = uuidv4();
        const salt = bcrypt.genSaltSync(10);
        const password_hash = bcrypt.hashSync(password, salt);

        //sending user information for registration
        if (id === null || password_hash === null) {
            return res.status(400).json({
                registration_status: "failed",
                error: {
                    ecode: 201,
                    details:
                        "uuidv4 failed to create id or or bcrypt failed to generate password hash.",
                },
            });
        }

        if (user_image) {
            const photo_name = uuidv4() + user_image.name;
            const photo_path = user_photo_initial_upload_path + photo_name;
            const photo_link = user_photo_initial_link + photo_name;

            req.photo_path = photo_path;
            req.photo = user_image;
            req.user = {
                user_id: id,
                first_name: first_name,
                last_name: last_name,
                email: email,
                password_hash: password_hash,
                account_type: account_type,
                joined_date: new Date(),
                user_image: photo_link,
            };
        } else {
            req.user = {
                user_id: id,
                first_name: first_name,
                last_name: last_name,
                email: email,
                password_hash: password_hash,
                account_type: account_type,
                joined_date: new Date(),
            };
        }
        next();
    }
};
