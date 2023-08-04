const { getUserFromEmail } = require("../Controllers/query.controller");
const requestify = require("requestify");

const googleTokenVerification = function (google_token) {
    return requestify
        .get(
            "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
                google_token
        )
        .then(function (response) {
            const email = response.getBody().email;
            return getUserFromEmail(email)
                .then((data) => {
                    if (data[0] != null) {
                        return Promise.resolve({ user: data[0] });
                    } else {
                        return Promise.reject({
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
                    return Promise.reject({
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
            return Promise.reject({
                google_token_verification_status: "failed",
                error: {
                    ecode: 801,
                    details:
                        "Failed to get information using provided google token.",
                    err: err,
                },
            });
        });
};

module.exports = {
    googleTokenVerification,
};
