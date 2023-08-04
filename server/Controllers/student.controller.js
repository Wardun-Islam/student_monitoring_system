const {
  getAllStudents,
  get_all_column_from_table,
  insert_into_table,
} = require("./query.controller");
const request = require("request");
const axios = require("axios").default;

const getStudentsController = (req, res) => {
  const { assignment_id } = req.body;
  const user = req.authorized_user;
  if (req.authorized_user) {
    if (assignment_id) {
      getAllStudents(assignment_id)
        .then((students_info) => {
          console.log(students_info[0].teacher_id);
          get_all_column_from_table({
            table_name: "users",
            where_value: {
              user_id: students_info[0].teacher_id,
            },
          })
            .then((teacher_info) => {
              console.log(teacher_info);
              return res.status(200).json({
                students_info: students_info,
                teacher_info: teacher_info[0],
              });
            })
            .catch((error) => {
              return res.status(400).json({
                students: null,
                error: {
                  ecode: 1301,
                  details:
                    "Getting error when trying to get teachers informations from database.",
                  err: error,
                },
              });
            });
        })
        .catch((error) => {
          return res.status(400).json({
            students: null,
            error: {
              ecode: 1300,
              details:
                "Getting error when trying to get students informations from database.",
              err: error,
            },
          });
        });
    } else {
      return res.status(400).json({
        students: null,
        error: {
          ecode: 902,
          details: "Required field assignment_id is missing.",
        },
      });
    }
  } else {
    return res.status(400).json({
      students: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

const addstudentimageController = (req, res) => {
  if (req.photo_move_error) {
    return res.status(400).json({
      assignment_image_added: false,
      error: {
        ecode: 1403,
        details: "Failed to store image.",
        err: req.photo_move_error,
      },
    });
  } else {
    const { assignment_id, page_number } = req.body;
    const photo_link = req.photo_link;
    const user = req.authorized_user;
    axios({
      method: "get",
      url: photo_link,
      responseType: "arraybuffer",
    })
      .then((base_image_respond) => {
        const baseImage =
          "data:" +
          base_image_respond.headers["content-type"] +
          ";base64," +
          Buffer.from(base_image_respond.data, "binary").toString("base64");
        axios({
          method: "get",
          url: user.user_image,
          responseType: "arraybuffer",
        })
          .then((target_image_respond) => {
            const targetImage =
              "data:" +
              target_image_respond.headers["content-type"] +
              ";base64," +
              Buffer.from(target_image_respond.data, "binary").toString(
                "base64"
              );
            const options = {
              method: "POST",
              url: "https://face-verification2.p.rapidapi.com/faceverification",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-rapidapi-host": "face-verification2.p.rapidapi.com",
                "x-rapidapi-key":
                  "02bbcb3687msh976510d46a35802p15145ejsn75713d852f93",
                useQueryString: true,
              },
              form: {
                image1Base64: baseImage,
                image2Base64: targetImage,
              },
            };
            request(options, function (error, response, body) {
              if (error) {
                return res.status(400).json({
                  assignment_image_added: false,
                  error: {
                    ecode: 1404,
                    details: "Failed to identify user using api.",
                    err: error,
                  },
                });
              }
              const similar_percent = JSON.parse(body).data.similarPercent;
              const is_user = similar_percent > 70;
              const data = {
                asi_id: Date.now().toString(),
                assignment_id: assignment_id,
                student_id: user.user_id,
                page_number: page_number,
                is_user: is_user,
                post_date: new Date().getTime(),
                image_link: photo_link,
              };
              console.log(data);

              insert_into_table({
                table_name: "assignment_student_image",
                data: data,
                returning_column: "assignment_id",
              })
                .then((assignment_id_data) => {
                  return res.status(200).json({
                    assignment_image_added: true,
                  });
                })
                .catch((error) => {
                  return res.status(400).json({
                    assignment_image_added: false,
                    error: {
                      ecode: 1404,
                      details: "Failed to store data in database.",
                      err: error,
                    },
                  });
                });
            });
          })
          .catch((err) => {
            return res.status(400).json({
              assignment_image_added: false,
              error: {
                ecode: 1404,
                details: "Failed get user image from database.",
                err: err,
              },
            });
          });
      })
      .catch((error) => {
        return res.status(400).json({
          assignment_image_added: false,
          error: {
            ecode: 1404,
            details: "Failed get stored image from database.",
            err: error,
          },
        });
      });
  }
};

const getIdentifiedImage = (req, res) => {
  const { assignment_id, student_id } = req.body;
  const user = req.authorized_user;
  if (req.authorized_user || user.account_type !== "teacher") {
    if (assignment_id && student_id) {
      get_all_column_from_table({
        table_name: "assignment_student_image",
        where_value: {
          assignment_id: assignment_id,
          student_id: student_id,
        },
      })
        .then((data) => {
          console.log(data);
          return res.status(200).json(data);
        })
        .catch((error) => {
          return res.status(400).json({
            identifiedimage: null,
            error: {
              ecode: 1301,
              details:
                "Getting error when trying to get teachers informations from database.",
              err: error,
            },
          });
        });
    } else {
      return res.status(400).json({
        identifiedimage: null,
        error: {
          ecode: 902,
          details: "Required field assignment_id, student_id is missing.",
        },
      });
    }
  } else {
    return res.status(400).json({
      identifiedimage: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

module.exports = {
  getStudentsController,
  addstudentimageController,
  getIdentifiedImage,
};
