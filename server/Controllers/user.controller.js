const { updateUserPhoto } = require("./file.controller");
const { updateTableRow } = require("./query.controller");
const updateUserInformation = (req, res) => {
  const { first_name, last_name, delete_teacher_image } = req.body;
  const user = req.authorized_user;
  var user_photo = null;
  if (req.files) {
    user_photo = req.files.user_image;
  }

  if (req.authorized_user) {
    if (
      (first_name && !first_name.match(/^[a-zA-Z. ]{2,30}$/)) ||
      (last_name && !last_name.match(/^[a-zA-Z. ]{2,30}$/))
    ) {
      return res.status(400).json({
        update_user: "failed",
        error: {
          ecode: 114,
          details: "Require field for update account is invalid.",
        },
      });
    }

    if (
      user.account_type === "student" &&
      user.user_image === null &&
      user_photo === null
    ) {
      return res.status(400).json({
        update_user: "failed",
        error: {
          ecode: 112,
          details: "Require field image for student account type is missing.",
        },
      });
    }
    updateUserPhoto({
      user: user,
      photo: user_photo,
      delete_photo: delete_teacher_image,
    })
      .then((update_info) => {
        if (update_info.updated === true) {
          const updatedUser = {
            ...user,
            ...{
              joined_date: new Date(user.joined_date),
              user_image: update_info.file_link,
            },
          };

          if (first_name) {
            Object.assign(updatedUser, {
              joined_date: new Date(user.joined_date),
              first_name: first_name,
            });
          }
          if (last_name) {
            Object.assign(updatedUser, {
              joined_date: new Date(user.joined_date),
              last_name: last_name,
            });
          }
          updateTableRow({
            table_name: "users",
            where_column: "user_id",
            where_value: user.user_id,
            update_data: updatedUser,
            returning_column: ["user_id"],
          })
            .then((value) => {
              if (value[0]) {
                return res.status(200).json({
                  update: true,
                });
              } else {
                return res.status(400).json({
                  update_user: "failed",
                  error: {
                    ecode: 1111,
                    details: "Failed update data inside database.",
                    err: error,
                  },
                });
              }
            })
            .catch((error) => {
              return res.status(400).json({
                update_user: "failed",
                error: {
                  ecode: 1111,
                  details: "Failed update data inside database.",
                  err: error,
                },
              });
            });
        } else {
          return res.status(400).json({
            update_user: "failed",
            error: {
              ecode: 1111,
              details: "Failed to update image.",
              err: error,
            },
          });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          update_user: "failed",
          error: {
            ecode: 1111,
            details: "Failed to update image.",
            err: error,
          },
        });
      });
  } else {
    return res.status(400).json({
      update_user: "failed",
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

module.exports = {
  updateUserInformation,
};
