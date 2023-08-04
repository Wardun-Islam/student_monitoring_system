const {
  insert_into_table,
  getTeacherClasses,
  getStudentClassesCode,
  getStudentClasses,
  get_from_table,
  get_all_column_from_table,
} = require("./query.controller");

const addClassRoomController = (req, res) => {
  if (req.authorized_user) {
    user = req.authorized_user;
    if (user.account_type === "teacher") {
      const { class_room_name, section } = req.body;
      const data = {
        class_room_id: Date.now().toString(),
        name: class_room_name,
        section: section,
        teacher_id: user.user_id,
        created: new Date(),
      };
      if (class_room_name) {
        insert_into_table({
          table_name: "class_room",
          data: data,
          returning_column: "class_room_id",
        })
          .then((class_room_id) => {
            return res.status(200).send({
              classroon_add: "successful",
            });
          })
          .catch((err) => {
            return res.status(400).json({
              class_room_add: "failed",
              error: {
                ecode: 401,
                details: "Failed to insert data into database.",
                err: err,
              },
            });
          });
      } else {
        return res.status(400).json({
          class_room_add: "failed",
          error: {
            ecode: 111,
            details: "Required field classroom name is missing.",
          },
        });
      }
    } else {
      return res.status(400).json({
        class_room_add: "failed",
        error: {
          ecode: 1100,
          details:
            "Invalid user, Student are not permitted to create classroom.",
        },
      });
    }
  } else {
    return res.status(400).json({
      class_room_add: "failed",
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const getClassRoomController = (req, res) => {
  if (req.authorized_user) {
    user = req.authorized_user;
    if (user.account_type === "teacher") {
      getTeacherClasses(user.user_id)
        .then((data) => {
          return res.status(200).send({
            classroom: data,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            classroom: null,
            error: {
              ecode: 609,
              details: "Failed to get classes from database.",
              err: err,
            },
          });
        });
    } else {
      getStudentClassesCode(user.user_id)
        .then((class_codes) => {
          let class_room_codes = class_codes.map((class_data) => {
            return class_data.class_id;
          });
          getStudentClasses(class_room_codes)
            .then((class_rooms) => {
              return res.status(200).send({
                classroom: class_rooms,
              });
            })
            .catch((error) => {
              return res.status(400).json({
                classroom: null,
                error: {
                  ecode: 609,
                  details: "Failed to get classes from database.",
                  err: error,
                },
              });
            });
        })
        .catch((error) => {
          return res.status(400).json({
            classroom: null,
            error: {
              ecode: 609,
              details: "Failed to get classes code from database.",
              err: error,
            },
          });
        });
    }
  } else {
    return res.status(400).json({
      class_room: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const joinClassRoomController = (req, res) => {
  if (req.authorized_user) {
    user = req.authorized_user;
    if (user.account_type === "teacher") {
      return res.status(400).json({
        classroom_join: "failed",
        error: {
          ecode: 120,
          details: "Teacher is not allowed in a class.",
        },
      });
    } else {
      if (req.body.class_code) {
        get_from_table({
          select_column: "class_room_id",
          table_name: "class_room",
          where_column: "class_room_id",
          where_value: req.body.class_code,
        })
          .then((class_code) => {
            if (class_code[0] != null) {
              if (class_code[0].class_room_id === req.body.class_code) {
                const data = {
                  class_id: req.body.class_code,
                  student_id: user.user_id,
                  joined_date: new Date(),
                };
                insert_into_table({
                  table_name: "class_student",
                  data: data,
                  returning_column: "class_id",
                })
                  .then((class_room_id) => {
                    return res.status(200).send({
                      classroom_join: "successful",
                    });
                  })
                  .catch((err) => {
                    return res.status(400).json({
                      classroom_join: "failed",
                      error: {
                        ecode: 401,
                        details: "Failed to insert data into database.",
                        err: err,
                      },
                    });
                  });
              } else {
                return res.status(400).json({
                  classroom_join: "failed",
                  error: {
                    ecode: 610,
                    details:
                      "The provided classes code is not with the code inside database.",
                  },
                });
              }
            } else {
              return res.status(400).json({
                classroom_join: "failed",
                error: {
                  ecode: 610,
                  details: "The provided classes code is not in database.",
                },
              });
            }
          })
          .catch((error) => {
            return res.status(400).json({
              classroom_join: "failed",
              error: {
                ecode: 609,
                details: "Failed to get class code from database.",
                err: error,
              },
            });
          });
      } else {
        return res.status(400).json({
          classroom_join: "failed",
          error: {
            ecode: 111,
            details: "Required field class_code is missing.",
          },
        });
      }
    }
  } else {
    return res.status(400).json({
      classroom_join: "failed",
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const classRoomDetailsController = (req, res) => {
  if (req.authorized_user) {
    user = req.authorized_user;
    if (req.body.class_code) {
      if (user.account_type === "teacher") {
        const whereValue = {
          teacher_id: user.user_id,
          class_room_id: req.body.class_code,
        };
        get_all_column_from_table({
          table_name: "class_room",
          where_value: whereValue,
        })
          .then((class_rooms) => {
            if (class_rooms[0] != null) {
              return res.status(200).send({
                class_info: class_rooms,
              });
            } else {
              return res.status(400).json({
                class_info: null,
                error: {
                  ecode: 610,
                  details:
                    "Failed to get classes from database, user is not resistered in the class.",
                },
              });
            }
          })
          .catch((err) => {
            return res.status(400).json({
              class_info: null,
              error: {
                ecode: 610,
                details:
                  "Failed to get classes from database due to database error.",
                err: err,
              },
            });
          });
      } else if (user.account_type === "student") {
        const whereValue = {
          student_id: user.user_id,
          class_id: req.body.class_code,
        };
        get_all_column_from_table({
          table_name: "class_student",
          where_value: whereValue,
        })
          .then((class_room_ids) => {
            if (class_room_ids[0] != null) {
              get_all_column_from_table({
                table_name: "class_room",
                where_value: { class_room_id: req.body.class_code },
              })
                .then((class_rooms) => {
                  if (class_rooms[0] != null) {
                    return res.status(200).send({
                      class_info: class_rooms,
                    });
                  } else {
                    return res.status(400).json({
                      class_info: null,
                      error: {
                        ecode: 610,
                        details:
                          "Failed to get classes from database, class code is not found in database.",
                      },
                    });
                  }
                })
                .catch((err) => {
                  return res.status(400).json({
                    class_info: null,
                    error: {
                      ecode: 610,
                      details:
                        "Failed to get classes from database due to database error.",
                      err: err,
                    },
                  });
                });
            } else {
              return res.status(400).json({
                class_info: null,
                error: {
                  ecode: 610,
                  details:
                    "Failed to get classes from database, user is not registered in class.",
                },
              });
            }
          })
          .catch((err) => {
            return res.status(400).json({
              class_info: null,
              error: {
                ecode: 610,
                details:
                  "Failed to get classes from database due to database error.",
                err: err,
              },
            });
          });
      } else {
        return res.status(400).json({
          class_info: null,
          error: {
            ecode: 112,
            details: "Invalid account type.",
          },
        });
      }
    } else {
      return res.status(400).json({
        class_info: null,
        error: {
          ecode: 113,
          details: "Required field class_code not found.",
        },
      });
    }
  } else {
    return res.status(400).json({
      class_info: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
      },
    });
  }
};

module.exports = {
  addClassRoomController,
  getClassRoomController,
  joinClassRoomController,
  classRoomDetailsController,
};
