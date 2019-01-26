const path = require('path')
const fs = require('fs')
let websiteTemplates = require('../config/website-templates')


let createFolderFromPath = (path) => {
    let arrDir = path.split('/')
    if(!arrDir)
        return

    let dirPath = ''
    for(index in arrDir) {
        if(index == 0)
            dirPath = arrDir[index]
        else
            dirPath = dirPath + '/' + arrDir[index]
        if(!fs.existsSync(dirPath)) {
            try {
                fs.mkdirSync(dirPath)
            } catch(err) {
                console.error(err)
            }
        }
    }
}

// NOTE: use https://www.npmjs.com/package/watch for listen changes on directory and regenerate templateFileNames
const generateTemplateFileNames = (templatesPath) => {
    let files = fs.readdirSync(templatesPath)
    let templateFileNames = []
    for(index in files) {
        let file = files[index]
        let fileExt =  path.extname(file)
        let fileName = path.basename(file, fileExt)
        if(fileName.indexOf('template-') >= 0 && fileExt.indexOf('.ejs') >= 0)
            templateFileNames.push({
                id: index,
                template_name: fileName.replace('template-', ''),
                template_full_name: fileName,
            })
    }
    websiteTemplates.templates = templateFileNames
}


module.exports = {
    createFolderFromPath: createFolderFromPath,
    generateTemplateFileNames: generateTemplateFileNames,
}
