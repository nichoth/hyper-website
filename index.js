const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
var matter = require('gray-matter')
var marked = require('marked')

module.exports = buildThem

function buildThem (inputDir, outputDir, { createHyperstream, templatePath }) {
    fs.readdir(inputDir, function (err, files) {
        if (err) throw err

        files.forEach(fileName => {
            if (fileName.charAt(0) === '_') return
            var _path = path.join(inputDir, fileName)
            var baseName = path.basename(fileName)

            fs.readFile(_path, 'utf8', (err, file) => {
                if (err) throw err

                const filePath = createHyperstream.outputPath(fileName)
                var outFileDir = outputDir + '/' + filePath

                mkdirp.sync(outFileDir)

                var fm = matter(file)
                var content = marked.parse(fm.content)

                var hs = createHyperstream(fm.data, content, baseName)
                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templatePath)

                rs.pipe(hs).pipe(ws)
            })
        })

    })
}
