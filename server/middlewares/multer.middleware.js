const multer = require('multer');
const path = require("path");
const fs = require('fs');
const sharp = require('sharp');

// 1. Subir primero a una carpeta temporal
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'tmp');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTemp = multer({ storage: tempStorage });

// 2. Middleware para convertir a WebP y mover al destino final
const convertToWebpAndMove = (folderName) => async (req, res, next) => {
  if (!req.file) return next();
  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, '..', 'uploads', folderName);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFilename = path.parse(req.file.filename).name + '.webp';
  const outputPath = path.join(outputDir, outputFilename);

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    try{
      fs.unlinkSync(inputPath);   // Borra el archivo temporal
    } catch(error){
      console.error('Error deleting temporary file:', error);
    }
    // Actualiza info en req.file
    req.file.path = outputPath;
    req.file.filename = outputFilename;
    req.file.mimetype = 'image/webp';
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadUsers: [
    uploadTemp.single('image'),
    convertToWebpAndMove('profiles')
  ],
  uploadPosts: [
    uploadTemp.single('image'),
    convertToWebpAndMove('posts')
  ],
  uploadGeneric: [
    uploadTemp.single('image'),
    convertToWebpAndMove('generic')
  ]
};