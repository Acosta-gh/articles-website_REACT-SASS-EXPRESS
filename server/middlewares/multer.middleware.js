const multer = require('multer');
const path = require("path");
const fs = require('fs');

const createUploader = (folderName) => multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '..', 'uploads', folderName);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

module.exports = {
  uploadUsers: createUploader('profiles'),
  uploadPosts: createUploader('posts'),
  uploadGeneric: createUploader('generic')
};