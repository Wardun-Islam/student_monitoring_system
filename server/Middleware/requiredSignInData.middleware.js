const { getUserFromEmail } = require("../Controllers/query.controller");
const { create_session } = require("../Controllers/session.controller");
const bcrypt = require("bcryptjs");
module.exports = function (req, res, next) {
    if (req.user) {
        create_session(req.user.user_id)
            .then((data) => {
                req.session = data;
                next();
            })
            .catch((error) => {
                return res.status(400).json(error);
            });
    } else {
        const { email, password } = req.body;
        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                signin_status: "failed",
                error: {
                    ecode: 107,
                    details: "Email or password is not valid.",
                },
            });
        }
        getUserFromEmail(email)
            .then((data) => {
                if (data[0] != null) {
                    const isValid = bcrypt.compareSync(
                        password,
                        data[0].password_hash
                    );
                    if (isValid) {
                        create_session(data[0].user_id)
                            .then((data) => {
                                req.session = data;
                                next();
                            })
                            .catch((error) => {
                                return res.status(400).json(error);
                            });
                    } else {
                        return res.status(400).json({
                            signin_status: "failed",
                            error: {
                                ecode: 901,
                                details: "Wrong password.",
                            },
                        });
                    }
                } else {
                    return res.status(400).json({
                        signin_status: "failed",
                        error: {
                            ecode: 802,
                            details:
                                "Failed to get user from database using provided email and password.",
                        },
                    });
                }
            })
            .catch((err) => {
                return res.status(400).json({
                    signin_status: "failed",
                    error: {
                        ecode: 802,
                        details:
                            "Failed to get user from database using provided email or password hash is invalid.",
                        err: err,
                    },
                });
            });
    }
};
