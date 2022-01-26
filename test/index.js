var buildThem = require('../')
const path = require('path')
var matter = require('gray-matter')
var marked = require('marked')
var hyperstream = require('hyperstream')


// this is the main template for an html file
// should include this by default for CLI version
// also use it as a default in node version
var templatePath = __dirname + '/_index.html'

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
        createHyperstream: makeHs,
        templatePath
    }
)

var navLinks = [
    ['Services', '/services'],
    ['Resources', '/resources'],
    ['About', '/about'],
    ['Consultation', '/consultation']
]

// a fn that returns a hs instance
function makeHs (fm, content, baseName) {
    // console.log('nav links', navLinks)
    console.log('basename', baseName)
    console.log('base 2', path.basename(baseName, '.md'))

    var h1 = fm.data.title ? `<h1>${fm.data.title}</h1>` : ''
    if (fm.data.title === 'home') {
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
                var [link, href] = item
                // var _basename = path.basename(filename, '.md')
                var cl = path.basename(href) === baseName ?
                    'active' :
                    ''
                if (baseName === 'home' && path.basename(href) === '') {
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
