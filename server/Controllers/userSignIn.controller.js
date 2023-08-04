const { insert_into_table } = require("./query.controller");
const { remove_file } = require("./file.controller");
const { create_session } = require("./session.controller");
module.exports = function (req, res) {
    return res.status(200).json(req.session);
};
