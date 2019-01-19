const path = require('path')
const crypto = require('crypto')
const dateTime = require('node-datetime')
const sharp = require('sharp')
const fs = require('fs')
const pump = require('pump')

const APP_CONFIG = require('../config/config')
const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')


const mediaUpload = (req, res) => {
    // NOTE: improve this
    return new Promise((resolve, reject) => {
        let mp = null
        let postData = {}
        let fileData = {}
        let uploadhandler = (field, file, fileName, encoding, mimeType) => {
            crypto.pseudoRandomBytes(16, (err, raw) => {
                let newfileName = raw.toString('hex') + dateTime.create().format('YmdHMS') + path.extname(fileName)
                let filePath = APP_CONFIG.uploadDirectory + newfileName
                fileData.originalName = fileName
                fileData.fileName = newfileName
                fileData.mimeType = mimeType
                fileData.size = 0
                fileData.path = newfileName
                fileData.filePath = filePath
                pump(file, fs.createWriteStream(filePath), pumpResultWriteFile)
            })
        }
        let pumpResultWriteFile = async (err) => {
            if(err) {
                reject(err)
                return
            }

            if(fileData.mimeType === 'image/png' || fileData.mimeType === 'image/jpeg') {
                let resizeImagePromises = []
                DASHBOARD_ADMIN_CONFIG.IMAGE_SIZES.forEach((size) => {
                    resizeImagePromises.push(resizeImage(APP_CONFIG.uploadDirectory, fileData.fileName, size[0], size[1]))
                })
                await Promise.all(resizeImagePromises)
            }
            resolve({
                postData: postData,
                fileData: fileData,
            })
        }
        mp = req.multipart(uploadhandler, (err) => {
            if(err) {
                reject(err)
                return
            }
        })
        mp.on('field', (key, value) => {
            postData[key] = value
        })
    })
}

const resizeImage = (destination, fileName, width, height) => {
    let sourceFilePath = destination + fileName
    let fileExt = path.extname(fileName)
    let resizeFilePath = destination + 'sizes/' + path.basename(fileName, fileExt) + '-' + width + 'x' + height + fileExt
    return sharp(sourceFilePath)
    .resize(width, height)
    .toFile(resizeFilePath)
}

module.exports = {
    mediaUpload: mediaUpload,
    resizeImage: resizeImage,
}
