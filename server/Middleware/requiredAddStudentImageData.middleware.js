const {
  assignment_photo_initial_upload_path,
  assignment_photo_initial_link,
} = require("../config");

module.exports = function (req, res, next) {
  const user = req.authorized_user;
  if (user) {
    const { assignment_id, page_number } = req.body;

    var image = null;

    if (req.files) {
      image = req.files.image;
    }

    if (!assignment_id || (!page_number && !image)) {
      return res.status(400).json({
        assignment_image_added: false,
        error: {
          ecode: 1402,
          details: "Required field is missing.",
        },
      });
    } else {
      const photo_name = image.name;
      const photo_path = assignment_photo_initial_upload_path + photo_name;
      const photo_link = assignment_photo_initial_link + photo_name;
      req.photo_path = photo_path;
      req.photo = image;
      req.photo_link=photo_link;
      next();
    }
  } else {
    return res.status(400).json({
      assignment_image_added: false,
      error: {
        ecode: 902,
        details: "Failed to authorize user.",
        err: req.authorized_user_error,
      },
    });
  }
};
