const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
var matter = require('gray-matter')
var marked = require('marked')

module.exports = buildThem

function buildThem (inputDir, outputDir, { createHyperstream, templatePath }) {
    var makeHs = createHyperstream

    fs.readdir(inputDir, function (err, files) {
        if (err) throw err

        files.forEach(fileName => {
            var _path = path.join(inputDir, fileName)
            var baseName = path.basename(fileName)

            fs.readFile(_path, 'utf8', (err, file) => {
                if (err) throw err

                // make a directory for each file that is the name of the file
                // (clean urls -- url with no file extension)
                // the 'home' file is special
                var outFileDir = outputDir + '/' + (baseName.includes('home') ?
                    '' :
                    baseName)

                mkdirp.sync(outFileDir)

                var fm = matter(file)
                var content = marked.parse(fm.content)

                var hs = makeHs(fm, content, baseName)

                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templatePath)
                rs.pipe(hs).pipe(ws)
            })
        })

    })
}
