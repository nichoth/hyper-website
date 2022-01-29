var buildThem = require('../')
const path = require('path')
// var matter = require('gray-matter')
// var marked = require('marked')
var hyperstream = require('hyperstream')


// this is the main template for an html file
// should include this by default for CLI version
// also use it as a default in node version
var templatePath = __dirname + '/src/_index.html'

// should automatically use a file ending with _ as a template

// need to
// * look for a template file

// should call makeHs with
// * the file basename
// * the parsed front matter


// how to create the public directory structure?
// in my site it depends on the front matter in each file
// it should be based on the structure of the source files


// (inputDir, outputDir, { templatePath, createHyperstream })
buildThem(
    __dirname + '/src',
    __dirname + '/test-public',
    {
        createHyperstream,
        templatePath
    }
)

var navLinks = [
    ['foo', '/foo'],
    ['bar', '/bar'],
    ['aaa', '/aaa'],
    ['bbb', '/bbb']
]

// a fn that returns a hs instance
function createHyperstream (fm, content, baseName) {
    // console.log('nav links', navLinks)
    console.log('*fm*', fm)
    console.log('**basename**', baseName)
    console.log('**base 2**', path.basename(baseName, '.md'))
    console.log('**content**', content)

    var h1 = fm.title ? `<h1>${fm.title}</h1>` : ''
    if (fm.title === 'home') {
        h1 = ''
    }

    return hyperstream({
        body: {
            class: { append: baseName },
            _appendHtml: h1 + content
        },

        // build the nav links for each page
        // b/c there is a different 'active' link on each page
        '.main-nav': {
            // need to deal with the order of the links
            _appendHtml: navLinks.reduce(function (acc, item) {
                const [link, href] = item
                const _baseName = path.basename(baseName, '.md')
                const cl = path.basename(href) === _baseName ?
                    'active' :
                    ''
                if (_baseName === 'home' && path.basename(href) === '') {
                    cl = 'active'
                }
                acc += `<li class="${cl}">
                    <a href="${href}">${link}</a>
                </li>`
                return acc
            }, '')
        }
    })
}

createHyperstream.outputPath = function (filePath) {
    if (filePath.includes('index.html')) return ''
    return path.basename(filePath, '.md')
}
