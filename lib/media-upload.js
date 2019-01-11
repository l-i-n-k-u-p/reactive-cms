const path = require('path')
const multer  = require('multer')
const crypto = require('crypto')
const dateTime = require('node-datetime')
const sharp = require('sharp')

const APP_CONFIG = require('../config/config')
const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config.js')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, APP_CONFIG.uploadDirectory)
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + dateTime.create().format('YmdHMS') + path.extname(file.originalname))
        })
    }
})
const upload = multer({ storage: storage }).single('file')


const mediaUpload = (req, res) => {
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
            if(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg')
                DASHBOARD_ADMIN_CONFIG.IMAGE_SIZES.forEach((size) => {
                    resizeImage(req.file.destination, req.file.filename, size[0], size[1])
                })
            resolve({
                postData: req.body,
                fileData: req.file,
            })
        })
    })
}

const resizeImage = (destination, fileName, width, height) => {
    // NOTE: improvement this with the promise use
    let sourceFilePath = destination+fileName
    let fileNameArray = fileName.split('.')
    let resizeFilePath = destination+'sizes/'+fileNameArray[0]+'-'+width+'x'+height+'.'+fileNameArray[1]
    sharp(sourceFilePath)
    .resize(width, height)
    .toFile(resizeFilePath)
    .then(data => {
        console.log('== resizeImage image resized ==', data)
    })
    .catch(err => {
        console.log('== resizeImage image error resizing ==', err)
    })
}


module.exports = {
    mediaUpload: mediaUpload,
    resizeImage: resizeImage,
}
