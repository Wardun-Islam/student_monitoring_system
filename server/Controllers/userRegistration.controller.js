const { insert_into_table } = require("./query.controller");
const { remove_file } = require("./file.controller");
const { create_session } = require("./session.controller");
module.exports = function (req, res) {
    insert_into_table({
        table_name: "users",
        data: req.user,
        returning_column: "user_id",
    })
        .then((user_id) => {
            create_session(user_id[0])
                .then((data) => {
                    return res.status(200).json({ session: data });
                })
                .catch((error) => {
                    return res.status(400).json(error);
                });
        })
        .catch((error) => {
            if (req.photo_path) {
                remove_file({ file_path: req.photo_path })
                    .then(() => {
                        return res.status(400).json({
                            registration_status: "failed",
                            error: {
                                ecode: 401,
                                details: "Failed to insert data into database.",
                                err: error,
                            },
                        });
                    })
                    .catch((err) => {
                        return res.status(400).json({
                            registration_status: "failed",
                            error: {
                                ecode: "401 302",
                                details:
                                    "Failed to insert data into database and failed to remove uploaded photo of user.",
                                err: [error, err],
                            },
                        });
                    });
            } else {
                return res.status(400).json({
                    registration_status: "failed",
                    error: {
                        ecode: 401,
                        details: "Failed to insert data into database.",
                        err: error,
                    },
                });
            }
        });
};
