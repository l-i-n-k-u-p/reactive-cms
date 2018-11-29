const getHexColor = function(string) {
    let hash = 6
    let i
    /* eslint-disable no-bitwise */
    for(i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for(i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        colour += `00${value.toString(16)}`.substr(-2)
    }
    /* eslint-enable no-bitwise */
    return 'background-color: '+colour+';'
}

const getAvatarURL = function (fileURL) {
    let fileNameArray = fileURL.split('.')
    let style = ''
    style += 'background-image: url('+'/uploads/sizes/'+fileNameArray[0]+'-150x150.'+fileNameArray[1]+');'
    style += 'background-size: cover;'
    style += 'background-position: center;'
    return style
}

const getThumbnailURL = function (fileURL) {
    let fileNameArray = fileURL.split('.')
    let style = ''
    style += 'background-image: url('+'/uploads/sizes/'+fileNameArray[0]+'-600x200.'+fileNameArray[1]+');'
    style += 'background-size: cover;'
    style += 'background-position: center;'
    return style
}


module.exports = {
    getHexColor,
    getAvatarURL,
    getThumbnailURL,
}
