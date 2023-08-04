const {
  insert_into_table,
  get_from_table,
  get_from_table_multiple_condition,
  get_all_column_from_table,
  getAllAssignments,
  getTeacherClasses,
  getStudentClassesCode,
} = require("./query.controller");

const addAssignmentController = (req, res) => {
  const data = {
    assignment_id: Date.now().toString(),
    class_id: req.body.class_id,
    post_description: req.body.post_description,
    post_date: new Date(),
    pdf_link: req.pdf_link,
  };
  insert_into_table({
    table_name: "assignment",
    data: data,
    returning_column: "assignment_id",
  })
    .then((assignment_id) => {
      if (assignment_id) {
        res.status(200).json({
          post: true,
        });
      } else {
        return res.status(400).json({
          add_assignment: "failed",
          error: {
            ecode: 512,
            details: "Failed to store in database.",
          },
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        add_assignment: "failed",
        error: {
          ecode: 512,
          details: "Failed to store in database.",
          err: error,
        },
      });
    });
};

const getAssignmentDetailsController = (req, res) => {
  const { assignment_id } = req.body;
  const user = req.authorized_user;
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
            class_id = data[0].class_id;
            if (user.account_type === "teacher") {
              get_from_table_multiple_condition({
                select_column: "teacher_id",
                table_name: "class_room",
                where_column_value: {
                  teacher_id: user.user_id,
                  class_room_id: class_id,
                },
              })
                .then((value) => {
                  if (value[0] != null) {
                    get_all_column_from_table({
                      table_name: "assignment",
                      where_value: {
                        assignment_id: assignment_id,
                      },
                    })
                      .then((assignment_details) => {
                        if (assignment_details[0] != null) {
                          return res.status(200).json({
                            assignment: assignment_details[0],
                          });
                        } else {
                          return res.status(400).json({
                            assignment: null,
                            error: {
                              ecode: 615,
                              details:
                                "No assignment information found in database.",
                            },
                          });
                        }
                      })
                      .catch((error) => {
                        return res.status(400).json({
                          assignment: null,
                          error: {
                            ecode: 615,
                            details:
                              "Failed to get assignment information from database.",
                          },
                        });
                      });
                  } else {
                    return res.status(400).json({
                      assignment: null,
                      error: {
                        ecode: 614,
                        details:
                          "Teacher is not registered in the provide class where the assignment belongs.",
                      },
                    });
                  }
                })
                .catch((error) => {
                  return res.status(400).json({
                    assignment: null,
                    error: {
                      ecode: 613,
                      details:
                        "Failed to get teacher and class information from database to the class assignment belongs.",
                    },
                  });
                });
            } else {
              get_from_table_multiple_condition({
                select_column: "student_id",
                table_name: "class_student",
                where_column_value: {
                  student_id: user.user_id,
                  class_id: class_id,
                },
              })
                .then((value) => {
                  if (value[0] != null) {
                    get_all_column_from_table({
                      table_name: "assignment",
                      where_value: {
                        assignment_id: assignment_id,
                      },
                    })
                      .then((assignment_details) => {
                        if (assignment_details[0] != null) {
                          return res.status(200).json({
                            assignment: assignment_details[0],
                          });
                        } else {
                          return res.status(400).json({
                            assignment: null,
                            error: {
                              ecode: 615,
                              details:
                                "No assignment information found in database.",
                            },
                          });
                        }
                      })
                      .catch((error) => {
                        return res.status(400).json({
                          assignment: null,
                          error: {
                            ecode: 615,
                            details:
                              "Failed to get assignment information from database.",
                          },
                        });
                      });
                  } else {
                    return res.status(400).json({
                      assignment: null,
                      error: {
                        ecode: 614,
                        details:
                          "Student is not registered in the provide class where the assignment belongs to.",
                      },
                    });
                  }
                })
                .catch((error) => {
                  return res.status(400).json({
                    assignment: null,
                    error: {
                      ecode: 613,
                      details:
                        "Failed to get student and class information from database where the assignment belongs to.",
                    },
                  });
                });
            }
          } else {
            return res.status(400).json({
              assignment: null,
              error: {
                ecode: 613,
                details:
                  "Failed to get class id from database for this assignment.",
              },
            });
          }
        })
        .catch((error) => {
          return res.status(400).json({
            assignment: null,
            error: {
              ecode: 613,
              details:
                "Failed to get class id from database for this assignment.",
              err: error,
            },
          });
        });
    } else {
      return res.status(400).json({
        assignment: null,
        error: {
          ecode: 101,
          details:
            "All required data is not provided through request for get assignments.",
        },
      });
    }
  } else {
    return res.status(400).json({
      assignment: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const getAllAssignmentsController = (req, res) => {
  const user = req.authorized_user;
  if (user) {
    if (user.account_type === "teacher") {
      getTeacherClasses(user.user_id)
        .then((class_codes) => {
          if (class_codes) {
            let class_room_codes = class_codes.map((class_data) => {
              return class_data.class_room_id;
            });
            getAllAssignments(class_room_codes)
              .then((assignments) => {
                if (assignments) {
                  return res.status(200).send({
                    assignments: assignments,
                  });
                } else {
                  return res.status(400).json({
                    assignments: null,
                    error: {
                      ecode: 906,
                      details: "Failed to get assignments from database.",
                    },
                  });
                }
              })
              .catch((error) => {
                return res.status(400).json({
                  assignments: null,
                  error: {
                    ecode: 903,
                    details: "Failed to get assignments from database.",
                    err: error,
                  },
                });
              });
          } else {
            return res.status(400).json({
              assignments: null,
              error: {
                ecode: 905,
                details: "Did not find classcodes in database.",
              },
            });
          }
        })
        .catch((error) => {
          return res.status(400).json({
            assignments: null,
            error: {
              ecode: 904,
              details: "Failed to get classcodes from database.",
              err: error,
            },
          });
        });
    } else {
      getStudentClassesCode(user.user_id)
        .then((class_codes) => {
          if (class_codes) {
            let class_room_codes = class_codes.map((class_data) => {
              return class_data.class_id;
            });
            getAllAssignments(class_room_codes)
              .then((assignments) => {
                if (assignments) {
                  return res.status(200).send({
                    assignments: assignments,
                  });
                } else {
                  return res.status(400).json({
                    assignments: null,
                    error: {
                      ecode: 906,
                      details: "Failed to get assignments from database.",
                    },
                  });
                }
              })
              .catch((error) => {
                return res.status(400).json({
                  assignments: null,
                  error: {
                    ecode: 903,
                    details: "Failed to get assignments from database.",
                    err: error,
                  },
                });
              });
          } else {
            return res.status(400).json({
              assignments: null,
              error: {
                ecode: 905,
                details: "Did not find classcodes in database.",
              },
            });
          }
        })
        .catch((error) => {
          return res.status(400).json({
            assignments: null,
            error: {
              ecode: 904,
              details: "Failed to get classcodes from database.",
              err: error,
            },
          });
        });
    }
  } else {
    return res.status(400).json({
      assignments: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const getClassroomAssignmentsController = (req, res) => {
  const { class_id } = req.body;
  const user = req.authorized_user;
  if (user) {
    if (class_id) {
      if (user.account_type === "teacher") {
        get_from_table_multiple_condition({
          select_column: "teacher_id",
          table_name: "class_room",
          where_column_value: {
            teacher_id: req.authorized_user.user_id,
            class_room_id: class_id,
          },
        })
          .then((value) => {
            if (value[0] != null) {
              get_all_column_from_table({
                table_name: "assignment",
                where_value: {
                  class_id: class_id,
                },
              })
                .then((assignments) => {
                  return res.status(200).json({
                    assignments: assignments,
                  });
                })
                .catch((error) => {
                  return res.status(400).json({
                    assignments: null,
                    error: {
                      ecode: 615,
                      details:
                        "Failed to get teacher and class information from database.",
                    },
                  });
                });
            } else {
              return res.status(400).json({
                assignments: null,
                error: {
                  ecode: 614,
                  details: "Teacher is not registered in the provide class.",
                },
              });
            }
          })
          .catch((error) => {
            return res.status(400).json({
              assignments: null,
              error: {
                ecode: 613,
                details:
                  "Failed to get teacher and class information from database.",
              },
            });
          });
      } else {
        get_from_table_multiple_condition({
          select_column: "student_id",
          table_name: "class_student",
          where_column_value: {
            student_id: user.user_id,
            class_id: class_id,
          },
        })
          .then((value) => {
            if (value[0] != null) {
              get_all_column_from_table({
                table_name: "assignment",
                where_value: {
                  class_id: class_id,
                },
              })
                .then((assignments) => {
                  return res.status(200).json({
                    assignments: assignments,
                  });
                })
                .catch((error) => {
                  return res.status(400).json({
                    assignments: null,
                    error: {
                      ecode: 615,
                      details:
                        "Failed to get student and class information from database.",
                    },
                  });
                });
            } else {
              return res.status(400).json({
                assignments: null,
                error: {
                  ecode: 614,
                  details: "Student is not registered in the provide class.",
                },
              });
            }
          })
          .catch((error) => {
            return res.status(400).json({
              assignments: null,
              error: {
                ecode: 613,
                details:
                  "Failed to get student and class information from database.",
              },
            });
          });
      }
    } else {
      return res.status(400).json({
        assignments: null,
        error: {
          ecode: 101,
          details:
            "All required data is not provided through request for get assignments.",
        },
      });
    }
  } else {
    return res.status(400).json({
      assignments: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

module.exports = {
  addAssignmentController,
  getAssignmentDetailsController,
  getAllAssignmentsController,
  getClassroomAssignmentsController,
};
