const path = require('path')
const multer  = require('multer')
const crypto = require('crypto')
const dateTime = require('node-datetime')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'site-static/uploads/')
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + dateTime.create().format('YmdHMS') + path.extname(file.originalname))
        })
    }
})
const upload = multer({ storage: storage }).single('file')


const MediaUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                reject(err)
                return
            } else if (err) {
                // An unknown error occurred when uploading.
                reject(err)
                return
            }
            resolve({
                postData: req.body,
                fileData: req.file,
            })
        })
    })
}


module.exports = {
    MediaUpload: MediaUpload,
}
