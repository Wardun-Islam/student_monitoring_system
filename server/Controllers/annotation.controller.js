const { get_all_column_from_table } = require("./query.controller");

const getAnnotationController = (req, res) => {
  const { documentId } = req.body;
  const user = req.authorized_user;
  if (user) {
    get_all_column_from_table({
      table_name: "annotations",
      where_value: {
        documentId: documentId,
      },
    })
      .then((data) => {
        return res.json(data);
      })
      .catch((error) => {
        return res.status(400).json({
          annotations: null,
          error: {
            ecode: 902,
            details: "Failed to get annotations from database.",
            err: error,
          },
        });
      });
  } else {
    return res.status(400).json({
      annotations: null,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};

module.exports = {
  getAnnotationController,
};
