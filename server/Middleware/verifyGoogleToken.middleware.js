const { getUserFromEmail } = require("../Controllers/query.controller");
const requestify = require("requestify");

module.exports = function (req, res, next) {
    const { google_token } = req.body;
    if (google_token) {
        requestify
            .get(
                "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
                    google_token
            )
            .then(function (response) {
                const email = response.getBody().email;
                getUserFromEmail(email)
                    .then((data) => {
                        if (data[0] != null) {
                            req.user = data[0];
                            next();
                        } else {
                            return res.status(400).json({
                                google_token_verification_status: "failed",
                                error: {
                                    ecode: 802,
                                    details:
                                        "Failed to get user from database using provided google token.",
                                },
                            });
                        }
                    })
                    .catch((error) => {
                        return res.status(400).json({
                            google_token_verification_status: "failed",
                            error: {
                                ecode: 802,
                                details:
                                    "Failed to get user from database using provided google token.",
                                err: error,
                            },
                        });
                    });
            })
            .catch((err) => {
                return res.status(400).json({
                    google_token_verification_status: "failed",
                    error: {
                        ecode: 801,
                        details:
                            "Failed to get information using provided google token.",
                        err: err,
                    },
                });
            });
    } else {
        next();
    }
};
