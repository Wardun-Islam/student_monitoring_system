const fs = require("fs");
const { getTeacherClasses } = require("../Controllers/query.controller");
const { v4: uuidv4 } = require("uuid");
const { pdf_initial_upload_path, pdf_initial_link } = require("../config");
const bcrypt = require("bcryptjs");

module.exports = function (req, res, next) {
    const { post_description, class_id } = req.body;
    var pdf = null;
    var pdf_name = null;
    if (req.files) {
        pdf = req.files.pdf;
        pdf_name = req.files.pdf.name;
    }
    if (!post_description || !class_id || !pdf) {
        return res.status(400).json({
            add_assignment: "failed",
            error: {
                ecode: 101,
                details:
                    "All required data is not provided through request for register new user.",
            },
        });
    }
    if (req.authorized_user) {
        const user = req.authorized_user;
        if (user.account_type === "teacher") {
            getTeacherClasses(user.user_id)
                .then((data) => {
                    if (data) {
                        let class_room_codes = data.map((class_data) => {
                            return class_data.class_room_id;
                        });
                        if (class_room_codes.includes(class_id)) {
                            pdf_name = uuidv4() + pdf_name;
                            pdf_path = pdf_initial_upload_path + pdf_name;
                            const pdf_link = pdf_initial_link + pdf_name;
                            const dir_list = pdf_path.split("/");
                            dir_list.pop();
                            const dir = dir_list.join("\\");
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir, { recursive: true });
                            }
                            pdf.mv(pdf_path)
                                .then(() => {
                                    req.pdf_link = pdf_link;
                                    next();
                                })
                                .catch((error) => {
                                    return res.status(400).json({
                                        add_assignment: "failed",
                                        error: {
                                            ecode: 121,
                                            details: "Failed to store pdf.",
                                        },
                                    });
                                });
                        } else {
                            return res.status(400).json({
                                add_assignment: "failed",
                                error: {
                                    ecode: 210,
                                    details:
                                        "Teacher is not registered in the provided class.",
                                },
                            });
                        }
                    } else {
                        return res.status(400).json({
                            add_assignment: "failed",
                            error: {
                                ecode: 711,
                                details: "User does not have any classes.",
                                err: error,
                            },
                        });
                    }
                })
                .catch((error) => {
                    return res.status(400).json({
                        add_assignment: "failed",
                        error: {
                            ecode: 710,
                            details:
                                "Failed to get data of class from database.",
                            err: error,
                        },
                    });
                });
        } else {
            return res.status(400).json({
                add_assignment: "failed",
                error: {
                    ecode: 1100,
                    details:
                        "Invalid user, Student are not permitted to create assignment.",
                },
            });
        }
    } else {
        return res.status(400).json({
            add_assignment: "failed",
            error: {
                ecode: 902,
                details: "Failed to authorize user.",
                err: req.authorized_user_error,
            },
        });
    }
};
