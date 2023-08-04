const { get_from_table, getTeacherClasses, getStudentClassesCode } = require("../Controllers/query.controller");

module.exports = function (req, res, next) {
    const user = req.authorized_user;
    const { assignment_id } = req.body;
    if (user) {
        if (assignment_id) {
            get_from_table({
                select_column: "class_id",
                table_name: "assignment",
                where_column: "assignment_id",
                where_value: assignment_id,
            })
                .then((data) => {
                    if (data[0] != null) {
                        const class_id = data[0].class_id;
                        if (user.account_type === "teacher") {
                            getTeacherClasses(user.user_id)
                                .then((classes) => {
                                    let class_room_codes = classes.map(
                                        (class_data) => {
                                            return class_data.class_room_id;
                                        }
                                    );
                                    if (class_room_codes.includes(class_id)) {
                                        req.verified = true;
                                        next();
                                    } else {
                                        req.verification_error = {
                                            ecode: 1204,
                                            details:
                                                "User is not register in the class where the assignment belongs to.",
                                        };
                                        next();
                                    }
                                })
                                .catch((error) => {
                                    console.log("classes");
                                    req.verification_error = {
                                        ecode: 1203,
                                        details:
                                            "No class_id foung in database with this assignment id and this user.",
                                    };
                                    next();
                                });
                        } else {
                            getStudentClassesCode(user.user_id)
                                .then((classes) => {
                                    let class_room_codes = classes.map(
                                        (class_data) => {
                                            return class_data.class_id;
                                        }
                                    );
                                    if (class_room_codes.includes(class_id)) {
                                        req.verified = true;
                                        next();
                                    } else {
                                        req.verification_error = {
                                            ecode: 1205,
                                            details:
                                                "User is not register in the class where the assignment belongs to.",
                                        };
                                        next();
                                    }
                                })
                                .catch((error) => {
                                    req.verification_error = {
                                        ecode: 1203,
                                        details:
                                            "No class_id foung in database with this assignment id and this user.",
                                    };
                                    next();
                                });
                        }
                    } else {
                        req.verification_error = {
                            ecode: 1202,
                            details:
                                "No class_id foung in database with this assignment id.",
                        };
                        next();
                    }
                })
                .catch((error) => {
                    req.verification_error = {
                        ecode: 1202,
                        details:
                            "Failed to get class_id for this assignment from database.",
                        err: error,
                    };
                    next();
                });
        } else {
            req.verification_error = {
                ecode: 1200,
                details: "Required field assignment_id is missing.",
            };
            next();
        }
    } else {
        req.verification_error = req.authorized_user_error;
        next();
    }
};
