const path = require("path");
const multer = require("multer");

const tempDir = path.join(__dirname, "..", "temp");
const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const newName = `${req.user.id}_${file.originalname}`;
        cb(null, newName);
    }
});

const upload = multer({
    storage: multerConfig});

module.exports = upload;