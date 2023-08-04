const { insert_into_table, getComments } = require("./query.controller");

const addCommentController = (req, res) => {
  const { assignment_id, comment } = req.body;
  const user = req.authorized_user;
  if (req.verified) {
    if (comment) {
      insert_into_table({
        table_name: "comments",
        data: {
          comment_id: Date.now().toString(),
          assignment_id: assignment_id,
          comment: comment,
          comment_time: new Date(),
          commenter_id: user.user_id,
          record_link: null,
        },
        returning_column: "comment_id",
      })
        .then((comment_id) => {
          if (comment_id) {
            res.status(200).json({
              post: true,
            });
          } else {
            return res.status(400).json({
              post: false,
              error: {
                ecode: 710,
                details: "Failed to store comment in database.",
              },
            });
          }
        })
        .catch((error) => {
          return res.status(400).json({
            post: false,
            error: {
              ecode: 710,
              details:
                "Failed to store comment in database due to database error.",
              err: error,
            },
          });
        });
    } else {
      return res.status(400).json({
        post: false,
        error: {
          ecode: 104,
          details: "required field comment is missing.",
        },
      });
    }
  } else {
    return res.status(400).json({
      post: false,
      error: req.verification_error,
    });
  }
};

const getCommentController = (req, res) => {
  if (req.verified) {
    getComments(req.body.assignment_id)
      .then((data) => {
        return res.status(200).json({
          comments: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          comments: null,
          error: {
            ecode: 504,
            details: "Failed to get comment info from database.",
          },
        });
      });
  } else {
    return res.status(400).json({
      comments: null,
      error: req.verification_error,
    });
  }
};

module.exports = {
  addCommentController,
  getCommentController,
};
