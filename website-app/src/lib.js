const getHexColor = (str) => {
    let hash = 5
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
    }
    return 'background-color: '+colour+';'
}

const getAvatarURL =  (fileURL) => {
    let fileNameArray = fileURL.split('.')
    let style = ''
    style += 'background-image: url('+'/uploads/sizes/'+fileNameArray[0]+'-150x150.'+fileNameArray[1]+');'
    style += 'background-size: cover;'
    style += 'background-position: center;'
    return style
}

const getThumbnailURL =  (fileURL) => {
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
