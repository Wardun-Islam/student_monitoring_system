const fs = require("fs");

module.exports = function (req, res, next) {
    if (req.photo_path) {
        dir_list = req.photo_path.split("/");
        dir_list.pop();
        const dir = dir_list.join("\\");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        req.photo
            .mv(req.photo_path)
            .then(() => {
                next();
            })
            .catch((error) => {
                req.photo_move_error = error;
                next();
            });
    } else {
        next();
    }
};
