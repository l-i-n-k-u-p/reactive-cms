const APP_CONFIG = require('../config/config')

const STATIC_UPLOADS_URL = `${ APP_CONFIG.staticUploadPathPrefix }/uploads/`
const STATIC_UPLOADS_SIZES_URL = `${ APP_CONFIG.staticUploadPathPrefix }/uploads/sizes`


const getHexColorFromString = (str) => {
  let hash = 5
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const getImageURL = (fileName, Size) => {
  if (!fileName)
    return ''

  let url = ''
  let fileNameArray = fileName.split('.')
  if (Size)
    url = `${ STATIC_UPLOADS_SIZES_URL }${ fileNameArray.shift() }-${ Size }.${ fileNameArray.pop() }`
  else
    url = `${ STATIC_UPLOADS_URL }${ fileName }`
  return url
}

module.exports.getHexColorFromString = getHexColorFromString
module.exports.getImageURL = getImageURL
