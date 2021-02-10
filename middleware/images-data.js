const multer = require('multer');

const imageValidation = multer
(
  {
    limits:
      {
        fileSize: 1000000
      },
    fileFilter(request, file, callback)
    {
      /*if (!file.originalname.match(/\.(jpg|jpge|png)$/))
      {
        return callback(new Error("Uploaded file type is not supported"));
      }*/
      callback(undefined, true);
    }
  }
);

module.exports = imageValidation;

